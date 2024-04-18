import { Route, Routes } from "react-router-dom";

import SharedLayout from "../../layout/SharedLayout";
import HomePage from "../pages/home";
import ResultPage from "../pages/result";
import RecipeListPage from "../pages/categoryrecipes";
import RecipePage from "../pages/recipe";

import LoginPage from "../pages/login";
import SignupPage from "../pages/signup";
import UserOnboardingForm from "../pages/onboarding";
import UserNutritionUpdateForm from "../pages/updatenutritionalvalues";
import CategoryPage from "../pages/categoryrecipes";
import PasswordResetPage from "../pages/reset-password";

export default function Myroutes() {
  return (
    <>
      <Routes>
        <Route element={<SharedLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<RecipeListPage />} path="viewall" />
          <Route element={<UserOnboardingForm />} path="user/onboarding" />
          {/* <Route element={<ResultPage />} path="/search-result" /> */}
          <Route
            element={<UserNutritionUpdateForm />}
            path="user/nutritional-value"
          />
        </Route>

        <Route element={<ResultPage />} path="/recommend/recipe" />
        <Route element={<RecipePage />} path="/recipe/:id" />
        <Route element={<CategoryPage />} path="/category/:id" />

        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<PasswordResetPage />} path="/reset-password" />
      </Routes>
    </>
  );
}
