import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { ClockIcon, FireIcon } from "@heroicons/react/24/outline";

const RecipePage = () => {
  const [recipeDetails, setRecipeDetails] = useState([]);
  const [nutritionalData, setnutritionalData] = useState({
    calories: 0,
    total_carbohydrate: 0,
    cholesterol: 0,
    total_fat: 0,
    saturated_fat: 0,
    dietry_fiber: 0,
    protein: 0,
    sodium: 0,
    sugars: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_API_URL}/recipes/${id}`
        );
        const res = {
          ...response.data,
          recipe_ingredients: eval(response.data.recipe_ingredients),
          recipe_instructions: eval(response.data.recipe_instructions),
        };
        const nutri = {
          calories: response.data.calories,
          total_fat: response.data.fat_content,
          saturated_fat: response.data.saturated_fat_content,
          total_carbohydrate: response.data.carbohydrate_content,
          cholesterol: response.data.cholesterol_content,
          sodium: response.data.sodium_content,
          dietry_fiber: response.data.fiber_content,
          sugars: response.data.sugar_content,
          protein: response.data.protein_content,
        };
        setRecipeDetails(res);
        setnutritionalData(nutri);
      } catch (error) {
        alert("Something Went Wrong");
        navigate("/error"); //Redirect or handle error
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, navigate]);

  const defaultImage =
    "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Handles the image error and sets the default image
  const handleImageError = (e) => {
    e.target.src = defaultImage; // Change the source to the default image
  };

  return (
    <>
      <div className="px-4 py-4 md:px-12 flex items-center mb-4">
        <button
          className="rounded-full p-2 bg-purple-600 text-white mr-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-6 w-6 " />
        </button>
        <h1
          style={{
            textTransform: "capitalize",
          }}
          className="w-screen ml-4 text-xl font-semibold text-left sm:text-center truncate"
        >
          {recipeDetails.recipe_name}
        </h1>
      </div>

      <div className="pb-8 w-full md:max-w-3xl mx-auto">
        <img
          src={recipeDetails.recipe_images}
          alt={recipeDetails.recipe_name}
          className="w-full h-22 shadow-md mb-4"
          onError={handleImageError}
        />
        <div className="px-4">
          <h1 className="text-3xl text-purple-600 font-extrabold my-2">
            {recipeDetails.recipe_name}
          </h1>
          <div className="flex items-center justify-start text-sm font-semibold space-x-5 mt-5">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 text-gray-500" />
              <span className="ml-1 text-gray-500">
                {recipeDetails.total_time} mins
              </span>
            </div>
            <div className="flex items-center">
              <FireIcon className="h-6 w-6 text-gray-500" />
              <span className="ml-1 mt-.5 text-gray-500">
                {Math.round(recipeDetails.calories)} kcal
              </span>
            </div>
          </div>
          <div className="mt-3">
            <h2
              style={{
                textTransform: "capitalize",
              }}
              className="text-sm font-semibold text-purple-400"
            >
              keywords :
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 px-1">
              {recipeDetails?.recipe_ingredients?.map((ingredient, index) => (
                <span
                  key={ingredient + index}
                  style={{
                    textTransform: "capitalize",
                  }}
                  className="p-2 py-1 rounded-full text-xs border bg-gray-100 text-gray-900 hover:bg-gray-100"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-purple-400">
              Description :
            </h2>
            <p className="text-sm mt-1 font-normal text-justify px-1">
              {recipeDetails?.recipe_description}
            </p>
          </div>
          <div className="mt-5">
            <h2
              style={{
                textTransform: "capitalize",
              }}
              className="text-sm font-semibold text-purple-400"
            >
              Ingredients :
            </h2>

            <ul className="list-disc pl-5 mb-4">
              {recipeDetails?.recipe_ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  style={{
                    textTransform: "capitalize",
                  }}
                  className="text-sm mt-2 text-semibold"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <h2
              style={{
                textTransform: "capitalize",
              }}
              className="text-sm font-semibold text-purple-400"
            >
              Instruction :
            </h2>
            <ol className="list-decimal text-left pl-5 mb-4 text-sm mt-3">
              {recipeDetails?.recipe_instructions?.map((step, index) => (
                <li key={index}> {step}</li>
              ))}
            </ol>
          </div>
          <div className="mt-5">
            <h2
              style={{
                textTransform: "capitalize",
              }}
              className="text-sm font-semibold text-purple-400"
            >
              Nutritional Information
            </h2>
            <ul className="list-none space-y-1 mt-3 px-2">
              {Object.entries(nutritionalData).map(([key, value]) => (
                <li
                  key={key}
                  className="flex justify-between text-gray-800 mt-1"
                >
                  <span className="capitalize text-gray-800 font-noraml text-sm">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm font-medium">
                    {key === "calories" ? Math.round(value) : value}{" "}
                    {key === "calories"
                      ? "kcal"
                      : key === "cholesterol" || key === "sodium"
                      ? "mg"
                      : "g"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipePage;
