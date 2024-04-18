import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";
import { useRecipe } from "../../utils/context/RecipeContext";

const RecipeCard = ({ recipe }) => {
  const defaultImage =
    "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const keywords = recipe.keywords
    .toString()
    .replace("[", "") // Remove the opening bracket
    .replace("]", "") // Remove the closing bracket
    .replace(/'/g, "") // Remove single quotes
    .split(", ") // Split the string by comma and space
    .join(", "); // Join the array elements with a comma

  const handleImageError = (e) => {
    e.target.src = defaultImage; // Change the source to the default image
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-300 m-2">
      <Link to={`/recipe/${recipe.recipe_id}`}>
        <img
          src={recipe.recipe_images || defaultImage}
          alt={recipe.recipe_name}
          className="w-full h-40 object-cover rounded-t-lg"
          onError={handleImageError}
        />
        <div className="px-4 py-2">
          <h3 className="text-lg font-semibold truncate">
            {recipe.recipe_name}
          </h3>
          <p
            className="text-xs text-gray-500 truncate mt-1"
            style={{ textTransform: "capitalize" }}
          >
            {keywords}
          </p>
          <div className="flex items-center text-sm mt-2 mb-2">
            <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span>{recipe.total_time} mins</span>
            <FireIcon className="h-5 w-5 text-gray-500 ml-4 mr-2" />
            <span>{Math.round(recipe.calories)} kcal</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { serachData } = useRecipe();

  return (
    <div className="relative px-5  md:px-12 ">
      <div className="fixed top-0 left-0 right-0 z-10 px-5  md:px-12 py-3 bg-white flex items-center mb-4">
        <button
          className="rounded-full p-2 bg-purple-600 text-white mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6 " />
        </button>
        <h1 className="ml-4 text-xl font-semibold">Search Results</h1>
      </div>
      <div className="grid grid-cols-1 mt-20 pb-5 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {serachData.map((recipe) => (
          <RecipeCard key={recipe.recipe_id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
