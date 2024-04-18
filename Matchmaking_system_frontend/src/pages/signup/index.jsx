import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../utils/context/AuthContext";

export default function RegistrationPage() {
  const usernameRef = useRef(null);
  const ageRef = useRef(null);
  const dietTypeRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const cnfpasswordRef = useRef(null);

  const errorRef = useRef(null);
  const successRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const { handleSignUp, user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const passwordPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    let formData = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      age: ageRef.current.value,
      diet_type: dietTypeRef.current.value,
    };

    if (errorRef.current) errorRef.current.textContent = "";
    if (successRef.current) successRef.current.textContent = "";
    const emailPattern = new RegExp(
      "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}"
    );
    if (passwordRef.current.value !== cnfpasswordRef.current.value) {
      alert("Passwords do not match!");
      setIsLoading(false);
    } else if (!emailPattern.test(usernameRef.current.value)) {
      if (errorRef.current) {
        errorRef.current.textContent = "Please enter a valid Email Address";
        setIsLoading(false);
      }
    } else if (!passwordPattern.test(passwordRef.current.value)) {
      if (errorRef.current) {
        errorRef.current.textContent =
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
        setIsLoading(false);
      }
    } else {
      handleSignUp(formData, errorRef, successRef, setIsLoading);
      usernameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      ageRef.current.value = "";
      dietTypeRef.current.value = "";
    }
  };
  useEffect(() => {
    const getStorageKey = localStorage.getItem("storageKey");
    const storedData = JSON.parse(localStorage.getItem(getStorageKey)) || {};
    if (user || storedData?.user) {
      navigate("/");
    }
    return () => {};
  }, []);

  return (
    <main className="fixed inset-0 overflow-y-auto p-4 bg-gray-50 sm:p-6">
      <div className="w-full max-w-md mx-auto bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden p-4 sm:my-8">
        <h2 className="text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900 p-2">
          Register for an account
        </h2>
        <div ref={errorRef} style={{ color: "red" }}></div>
        <div ref={successRef} style={{ color: "green" }}></div>
        <form className="space-y-4 overflow-y-auto p-4" onSubmit={handleSubmit}>
          {/* User's Full Name */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Full Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="eg. John Doe"
              ref={usernameRef}
              minLength={2}
            />
          </div>
          {/* User's Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Your Age"
              ref={ageRef}
            />
          </div>
          {/* User's is Vegan, Vegetarian, Non-Vegetarian */}
          <div>
            <label
              htmlFor="dietType"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Diet Type
            </label>
            <select
              id="dietType"
              name="dietType"
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ref={dietTypeRef}
            >
              <option value="" hidden>
                Select Diet Type
              </option>
              <option value=" ">None</option>
              <option value="Vegan">Vegan</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          {/* User's Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="you@example.com"
              ref={emailRef}
              pattern="[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}"
              title="Please enter a valid email address."
            />
          </div>
          {/* User's Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              ref={passwordRef}
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="********"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
            />
          </div>
          {/* User's Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="********"
              ref={cnfpasswordRef}
            />
          </div>
          {/* Registration Submit button */}
          <div className="pt-2 pb-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-700"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center mt-2 pb-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
