import { v4 as uuidv4 } from "uuid";

export const setSession = (
  accessToken,
  refreshToken,
  user,
  authState,
  setAuthState,
  setUser
) => {
  const storageKey = authState.storageKey || uuidv4() + "-auth-token";
  const tokenData = { accessToken, refreshToken, user };
  localStorage.setItem(storageKey, JSON.stringify(tokenData));
  localStorage.setItem("storageKey", storageKey);
  setAuthState({
    ...tokenData,
    storageKey,
    isAuthenticating: false,
  });
  setUser(user);
};

export const clearSession = (authState, setAuthState) => {
  if (authState.storageKey) {
    localStorage.removeItem(authState.storageKey);
    localStorage.removeItem("storageKey");
  }
  setAuthState({
    accessToken: null,
    refreshToken: null,
    userId: null,
    storageKey: null,
    isAuthenticating: false,
  });
};
