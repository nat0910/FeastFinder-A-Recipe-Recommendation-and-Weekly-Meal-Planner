import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InitialState = {
  calories: "",
  commonly_used_ingredients: "",
  preferred_cooking_time: "",
  preferred_prep_time: "",
  preferred_total_cooking_time: "",
  allergies: [],
  preferred_cuisines: [],
  fat_content: "",
  saturated_fat_content: "",
  cholesterol_content: "",
  sodium_content: "",
  carbohydrate_content: "",
  fiber_content: "",
  sugar_content: "",
  protein_content: "",
};

const UserOnboardingForm = () => {
  const [formData, setFormData] = useState(InitialState);

  const allergiesTypes = [
    "Dairy",
    "Eggs",
    "Fish",
    "Shellfish",
    "Tree Nuts",
    "Peanuts",
    "Wheat & Gluten",
    "Soy",
    "Sesame",
    "Sulfites",
    "Mustard",
    "Lupin",
    "Celery",
    "Corn",
    "Fruits",
    "Nightshades",
    "Legumes",
    "Alliums",
    "Chemical Additives",
    "MSG",
    "Aspartame",
    "Caffeine",
    "Alcohol",
    "Spices",
    "Molds",
    "Yeast",
    "Latex",
  ];

  const nutrination_values = [
    "calories",
    "fat_content",
    "saturated_fat_content",
    "cholesterol_content",
    "sodium_content",
    "carbohydrate_content",
    "fiber_content",
    "sugar_content",
    "protein_content",
  ];

  const cuisines = [
    "European",
    "Asian",
    "Mexican",
    "Greek",
    "Thai",
    "Japanese",
    "Southwest Asia (middle East)",
    "Southwestern U.S.",
    "Tex Mex",
    "African",
    "Spanish",
    "Italian",
    "French",
    "Indian",
    "Caribbean",
    "Pakistani",
    "Creole",
    "Chinese",
    "Korean",
    "Vietnamese",
    "Russian",
    "Moroccan",
    "Turkish",
    "Lebanese",
    "Hungarian",
    "Scottish",
    "Polish",
    "Brazilian",
    "South African",
    "Swedish",
    "Norwegian",
    "Malaysian",
    "Indonesian",
    "Cuban",
    "Danish",
    "Polynesian",
    "Puerto Rican",
    "Egyptian",
    "Austrian",
    "Peruvian",
    "Ethiopian",
    "Finnish",
    "Welsh",
    "Chilean",
    "Belgian",
    "Cambodian",
    "Costa Rican",
    "Colombian",
    "Nepalese",
    "Czech",
    "Dutch",
    "Greek",
    "Iraqi",
    "Nigerian",
    "Somalian",
    "Sudanese",
    "Mongolian",
    "Ecuadorean",
    "Honduran",
    "Georgian",
    "Venezuelan",
    "Guatemalan",
    "Icelandic",
  ];

  const common_ingredients = [
    "chicken",
    "beef",
    "pork",
    "tofu",
    "salmon",
    "shrimp",
    "lamb",
    "paneer",
    "rice",
    "pasta",
    "noodles",
    "quinoa",
    "barley",
    "lentils",
    "beans",
    "tomato",
    "potato",
    "carrot",
    "onion",
    "garlic",
    "lettuce",
    "spinach",
    "broccoli",
    "cauliflower",
    "cucumber",
    "bell pepper",
    "mushroom",
    "apple",
    "banana",
    "orange",
    "lemon",
    "lime",
    "strawberry",
    "blueberry",
    "mango",
    "sugar",
    "salt",
    "pepper",
    "vinegar",
    "oil",
    "butter",
    "flour",
    "eggs",
    "milk",
    "cheese",
    "yogurt",
    "cream",
    "nuts",
    "almonds",
    "peanuts",
    "walnuts",
    "basil",
    "parsley",
    "cilantro",
    "rosemary",
    "thyme",
    "oregano",
    "cumin",
    "paprika",
    "curry",
    "turmeric",
    "saffron",
    "ginger",
    "cinnamon",
    "vanilla",
    "chili",
    "jalapeno",
    "habanero",
    "serrano",
    "black beans",
    "kidney beans",
    "chickpeas",
    "soy sauce",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (allergy) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      allergies: prevFormData.allergies.includes(allergy)
        ? prevFormData.allergies.filter((a) => a !== allergy)
        : [...prevFormData.allergies, allergy],
    }));
  };

  const handleCuisineChange = (cuisine) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      preferred_cuisines: prevFormData.preferred_cuisines.includes(cuisine)
        ? prevFormData.preferred_cuisines.filter((c) => c !== cuisine)
        : [...prevFormData.preferred_cuisines, cuisine],
    }));
  };

  const handleIngredientChange = (ingredient) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      commonly_used_ingredients:
        prevFormData.commonly_used_ingredients.includes(ingredient)
          ? prevFormData.commonly_used_ingredients.filter(
              (c) => c !== ingredient
            )
          : [...prevFormData.commonly_used_ingredients, ingredient],
    }));
  };

  const { user, authState, setSession, setAuthState, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.commonly_used_ingredients.length < 5) {
      alert("Please select at least five ingredients.");
    } else if (formData.preferred_cuisines.length < 3) {
      alert("Please select at least three cuisines.");
    } else {
      const submitdata = {
        user_id: user.user_id,
        commonly_used_ingredients:
          formData.commonly_used_ingredients.toString(),
        allergies: formData.allergies.toString(),
        preferred_cuisines: formData.preferred_cuisines.toString(),
        calories: formData.calories == "" ? 0 : formData.calories,
        fat_content: formData.fat_content == "" ? 0 : formData.fat_content,
        saturated_fat_content:
          formData.saturated_fat_content == ""
            ? 0
            : formData.saturated_fat_content,
        cholesterol_content:
          formData.cholesterol_content == "" ? 0 : formData.cholesterol_content,
        sodium_content:
          formData.sodium_content == "" ? 0 : formData.sodium_content,
        carbohydrate_content:
          formData.carbohydrate_content == ""
            ? 0
            : formData.carbohydrate_content,
        fiber_content:
          formData.fiber_content == "" ? 0 : formData.fiber_content,
        sugar_content:
          formData.sugar_content == "" ? 0 : formData.sugar_content,
        protein_content:
          formData.protein_content == "" ? 0 : formData.protein_content,
        preferred_prep_time:
          formData.preferred_prep_time == "" ? 0 : formData.preferred_prep_time,
        preferred_cooking_time:
          formData.preferred_cooking_time == ""
            ? 0
            : formData.preferred_cooking_time,
        preferred_total_cooking_time:
          formData.preferred_total_cooking_time == ""
            ? 0
            : formData.preferred_total_cooking_time,
      };

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_API_URL}/user/onboarding`,
          submitdata,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("Onboarding completed successfully!");

        // After successful onboarding, call the compute_cluster endpoint
        const clusterResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_API_URL}/user/compute_cluster`,
          { user_id: user.user_id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const weeklyPlanResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_BASE_API_URL
          }/meal-plan/new-user-weekly-meal/?user_id=${user.user_id}`
        );

        setFormData(InitialState);

        let newUserState = {
          ...authState.user,
          isonboarding: true,
        };
        setSession(
          authState.access_token,
          authState.refreshToken,
          newUserState,
          authState,
          setAuthState,
          setUser
        );
        navigate("/");
      } catch (error) {
        console.error(
          "Failed during the onboarding or cluster computation process:",
          error
        );
        alert("Failed to complete onboarding. Please try again later.");
      }
    }
  };

  useEffect(() => {
    const getStorageKey = localStorage.getItem("storageKey");
    const storedData = JSON.parse(localStorage.getItem(getStorageKey)) || {};
    if (storedData.user.isonboarding == true) {
      navigate("/");
    }
    return () => {};
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Onboarding Form</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Perfered Cuisines selection with circular labels */}
        <fieldset className="mt-4">
          <legend
            className="text-base font-medium text-gray-900"
            style={{
              textTransform: "capitalize",
            }}
          >
            Commonly used ingridents (choose at least 5)
          </legend>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {common_ingredients.sort().map((ingredients) => (
              <label
                key={ingredients}
                className={`cursor-pointer p-2  rounded-full border ${
                  formData.commonly_used_ingredients.includes(ingredients)
                    ? "bg-purple-600 text-gray-200"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-100"
                } text-xs`}
              >
                <input
                  type="checkbox"
                  name="commonly_used_ingredients"
                  value={ingredients}
                  checked={formData.commonly_used_ingredients.includes(
                    ingredients
                  )}
                  onChange={() => handleIngredientChange(ingredients)}
                  className="sr-only"
                />
                {ingredients}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Perfered Cuisines selection with circular labels */}
        <fieldset className="mt-4">
          <legend
            className="text-base font-medium text-gray-900"
            style={{
              textTransform: "capitalize",
            }}
          >
            Preferred Cuisines (Choose atleast 3)
          </legend>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {cuisines.sort().map((cuisine, index) => (
              <label
                key={cuisine + index}
                className={`cursor-pointer p-2  rounded-full border ${
                  formData.preferred_cuisines.includes(cuisine)
                    ? "bg-purple-600 text-gray-200"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-100"
                } text-xs`}
              >
                <input
                  type="checkbox"
                  name="preferredCuisines"
                  value={cuisine}
                  checked={formData.preferred_cuisines.includes(cuisine)}
                  onChange={() => handleCuisineChange(cuisine)}
                  className="sr-only"
                />
                {cuisine}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Allergies selection with circular labels */}
        <fieldset className="mt-4">
          <legend className="text-base font-medium text-gray-900">
            Allergies
          </legend>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {allergiesTypes.map((allergy) => (
              <label
                key={allergy}
                className={`cursor-pointer p-2  rounded-full border ${
                  formData.allergies.includes(allergy)
                    ? "bg-purple-600 text-gray-200"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-100"
                } text-xs`}
              >
                <input
                  type="checkbox"
                  name="allergies"
                  value={allergy}
                  checked={formData.allergies.includes(allergy)}
                  onChange={() => handleAllergyChange(allergy)}
                  className="sr-only"
                />
                {allergy}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Perfered prep , cook timing with circular labels */}
        <label
          htmlFor="preferedtimings"
          className="text-base font-medium text-gray-900 mt-4"
        >
          Perfered Timings
        </label>

        <label
          htmlFor="preferedpreptimings"
          className="text-base font-medium text-gray-500 text-xs"
        >
          Perfered Prep Time
        </label>
        <input
          id="preferedpreptimings"
          type="number"
          name="preferred_prep_time"
          placeholder="Prep Time (in minutes)"
          value={formData.preferred_prep_time}
          onChange={handleInputChange}
          className="input border border-gray-300 p-2 rounded text-xs"
        />

        <label
          htmlFor="preferedcookingtimings"
          className="text-base font-medium text-gray-500 text-xs"
        >
          Perfered Cooking Time
        </label>
        <input
          id="preferedcookingtimings"
          type="number"
          name="preferred_cooking_time"
          placeholder="Cooking Time (in minutes)"
          value={formData.preferred_cooking_time}
          onChange={handleInputChange}
          className="input border border-gray-300 p-2 rounded text-xs"
        />

        <label
          htmlFor="preferedcookingtimings"
          className="text-base font-medium text-gray-500 text-xs"
        >
          Perfered Total Cooking Time
        </label>
        <input
          id="preferedcookingtimings"
          type="number"
          name="preferred_total_cooking_time"
          placeholder="Cooking Time (in minutes)"
          value={formData.preferred_total_cooking_time}
          onChange={handleInputChange}
          className="input border border-gray-300 p-2 rounded text-xs"
        />

        {/* Input fields for nutritional contents */}
        <label className="text-base font-medium text-gray-900">
          Nutritional Values
        </label>
        {nutrination_values.map((item, index) => {
          return (
            <React.Fragment key={item + index}>
              <label
                htmlFor={item}
                style={{
                  textTransform: "capitalize",
                }}
                className="text-xs font-medium text-gray-700"
              >
                {item.split("_").join(" ")}
              </label>
              <input
                type="number"
                name={item}
                style={{
                  textTransform: "capitalize",
                }}
                placeholder={
                  item === "calories"
                    ? `${item.split("_").join(" ")} (in kcal)`
                    : `${item.split("_").join(" ")} (in grams)`
                }
                value={formData[item]}
                onChange={handleInputChange}
                className="input border border-gray-300 p-2 rounded text-xs"
              />
            </React.Fragment>
          );
        })}
        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded hover:bg-purple-800 mt-5"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserOnboardingForm;
