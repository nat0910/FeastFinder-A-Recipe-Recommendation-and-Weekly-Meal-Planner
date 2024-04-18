import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";

const RecipeCard = ({ recipe }) => {
  const keywords = recipe.keywords
    .toString()
    .replace("[", "")
    .replace("]", "")
    .replace(/'/g, "")
    .split(", ")
    .join(", ");

  const defaultImage =
    "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Handles the image error and sets the default image
  const handleImageError = (e) => {
    e.target.src = defaultImage; // Change the source to the default image
  };

  return (
    <div className="flex-none bg-white rounded-lg shadow border border-gray-300 w-64 h-55">
      <Link to={`/recipe/${recipe.recipe_id}`}>
        <img
          src={recipe.recipe_images || defaultImage}
          alt={recipe.recipe_name}
          className="w-full h-32 object-cover rounded-lg"
          onError={handleImageError} // Add the onError handler here
        />
        <div className="px-3 py-1 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3
              className="text-md font-semibold truncate w-5/6 text-left"
              style={{ textTransform: "capitalize" }}
            >
              {recipe.recipe_name}
            </h3>
          </div>
          <p
            className="text-xs text-gray-500 truncate"
            style={{ textTransform: "capitalize" }}
          >
            {keywords}
          </p>
          <div className="flex items-center justify-start text-xs space-x-2 mt-3 pb-2">
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="ml-1 text-gray-500">
                {recipe.total_time} mins
              </span>
            </div>
            <div className="flex items-center">
              <FireIcon className="h-4 w-4 text-gray-500" />
              <span className="ml-1 mt-.5 text-gray-500">
                {Math.round(recipe.calories)} kcal
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
