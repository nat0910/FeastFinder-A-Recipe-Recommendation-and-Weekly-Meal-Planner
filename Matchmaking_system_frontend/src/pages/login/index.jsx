import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { handleLogin, user } = useAuth();

  function onLoginSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    handleLogin(emailRef?.current?.value, passwordRef?.current?.value);
    setIsLoading(false);
  }
  const navigate = useNavigate();

  useEffect(() => {
    const getStorageKey = localStorage.getItem("storageKey");
    const storedData = JSON.parse(localStorage.getItem(getStorageKey)) || {};
    if (user || storedData?.user) {
      navigate("/");
    }
    return () => {};
  }, []);

  return (
    <>
      <main className="flex h-screen w-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-md px-6 py-8 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <form className="space-y-6" method="POST" onSubmit={onLoginSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="you@example.com"
                    ref={emailRef}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <Link
                      to={"/reset-password"}
                      className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="********"
                    ref={passwordRef}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Wait" : "Sign in"}
                </button>
              </div>
            </form>
          </div>

          {/* Link to create a new account */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup" // Update the link to point to your signup page route
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create new account
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
