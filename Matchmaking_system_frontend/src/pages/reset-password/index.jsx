import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // This API call should check if the email is valid and can be reset
      const response = await axios.post(
        "http://127.0.0.1:5000/user/check-email",
        { email }
      );
      setIsLoading(false);
      if (response.data.exists) {
        setStep(2); // Proceed to password reset step
      } else {
        setError("No account found with that email.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      // This API call should update the user's password

      await axios.post("http://127.0.0.1:5000/user/reset-password", {
        email,
        new_password: password,
      });
      setIsLoading(false);
      alert(
        "Your password has been reset.You can sign in with your new password"
      );
      navigate("/login"); // Redirect user to login page after reset
    } catch (err) {
      setIsLoading(false);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-md px-6 py-8 bg-white border border-gray-300 rounded-lg shadow-lg">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
              Reset Password
            </h2>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700"
              disabled={isLoading}
            >
              Enter Email
            </button>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
              Set New Password
            </h2>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="mt-2 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700"
              disabled={isLoading}
            >
              Reset Password
            </button>
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
