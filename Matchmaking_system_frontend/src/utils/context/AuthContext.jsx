import { useContext, useEffect, useState, createContext } from "react";
import { setSession, clearSession } from "../functions/authFunctions";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

const authProviderUrl = "http://127.0.0.1:5000";

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getStorageKey = localStorage.getItem("storageKey");
  const storedData = JSON.parse(localStorage.getItem(getStorageKey)) || {};

  const [user, setUser] = useState(storedData?.user);
  const [authState, setAuthState] = useState({
    accessToken: storedData?.accessToken || null,
    refreshToken: storedData?.refreshToken || null,
    user: storedData?.user || null,
    storageKey: getStorageKey,
    isAuthenticating: true,
  });

  async function handleLogin(email, password) {
    // Basic input validation
    if (!email || !password) {
      console.error("Login attempt without email or password");
      alert("Email and password are required.");
      return; // Exit the function if no email or password provided
    }
    try {
      const response = await axios.post(`${authProviderUrl}/user/signin`, {
        email,
        password,
      });

      const { access_token, refresh_token, user } = response.data;

      setSession(
        access_token,
        refresh_token,
        user,
        authState,
        setAuthState,
        setUser
      );
      setUser(user);
      navigate("/");
    } catch (error) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        // console.error(
        //   `Login failed with status ${error.response.status}: ${error.response.data.error}`
        // );
        switch (error.response.status) {
          case 400:
            alert("Invalid request. Please check your inputs.");
            break;
          case 401:
            alert("Unauthorized. Check your email and password.");
            break;
          case 404:
            alert("User not found.");
            break;
          case 500:
            alert("Server error. Please try again later.");
            break;
          default:
            alert("An error occurred. Please try again.");
            break;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(
          "Login request made but no response received:",
          error.request
        );
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error during login. Please try again.");
      } // Rethrow after handling so you can catch it elsewhere if needed
    }
  }

  function handleLogout() {
    clearSession(authState, setAuthState);
    setUser(null);
    navigate("/login");
  }

  async function handleSignUp(formData, successRef, errorRef, setIsLoading) {
    try {
      const response = await axios.post(
        `${authProviderUrl}/user/register`,
        formData
      );
      let response_message = response.data.message;
      console.log("Success", response.data.message);
      if (response.status == 201) {
        if (successRef.current)
          successRef.current.textContent = response_message;
        alert("Your Account has been created.Please sign in");
        navigate("/login");
      } else {
        errorRef.current.textContent =
          errorRef.current.textContent + response_message;
        setIsLoading(false);
      }
    } catch (error) {
      if (errorRef.current)
        errorRef.current.textContent =
          error.response?.data?.message || "Failed to create account.";
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post(`${authProviderUrl}/refresh-token`, {
        headers: {
          Authorization: `Bearer ${authState.refreshToken}`,
        },
      });

      // Checking if the expected access_token is present in the response
      if (response.data && response.data.access_token) {
        const { access_token } = response.data;
        setSession(
          access_token,
          authState.refreshToken,
          authState.user,
          authState,
          setAuthState,
          setUser
        );
        navigate("/");
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      if (error.response && error.response.status === 401) {
        // Specific error handling for unauthorized attempts, possibly clear session
        console.error(
          "Refresh token is invalid or expired, user needs to re-login"
        );
        handleLogout();
      } else {
        // General error handling, decide whether to retry based on the error nature and frequency
        console.error(
          "An error occurred while refreshing the token:",
          error.message
        );
      }
    }
  };

  useEffect(() => {
    if (authState.refreshToken && !authState.storageKey) {
      refreshToken().catch(console.error);
    } else {
      setAuthState((state) => ({ ...state, isAuthenticating: false }));
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;
        if (response.status === 401 && !config._retry) {
          config._retry = true;
          try {
            await refreshToken();
            return axios(config);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [authState.refreshToken]);

  useEffect(() => {
    const getStorageKey = localStorage.getItem("storageKey");
    const storedData = JSON.parse(localStorage.getItem(getStorageKey)) || {};
    if (storedData?.user?.isonboarding == false) {
      navigate("/user/onboarding");
    }
    return () => {};
  }, [authState]);

  useEffect(() => {
    // Check if there is no user and no access token in local storage
    const userExists = user || localStorage.getItem("accessToken");

    // Paths where no redirect should occur
    const nonRedirectPaths = ["/signup", "/reset-password"];

    // Condition for redirection: no user or token, and path is not in the nonRedirectPaths
    if (!userExists && !nonRedirectPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        handleLogin,
        handleLogout,
        handleSignUp,
        setSession,
        authState,
        setAuthState,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
