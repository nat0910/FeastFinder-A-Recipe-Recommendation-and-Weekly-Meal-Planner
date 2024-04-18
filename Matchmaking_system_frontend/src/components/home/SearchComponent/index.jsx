import React, { useState } from "react";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
  ChevronUpIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useAuth } from "../../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRecipe } from "../../../utils/context/RecipeContext";

const cuisines = [
  "European",
  "Asian",
  "Mexican",
  "Chinese",
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

const SearchBarWithFilters = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [nutritionalParameters, setNutritionalParameters] = useState(false);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [totalcookTime, setTotalcookTime] = useState("");
  const [dietType, setDietType] = useState("");

  const [filterData, setFilterData] = useState({
    cuisines: "", // join array elements into a comma-separated string
    nutritional_match: false,
    prepTime: 0,
    cookTime: 0,
    totalcookTime: 0,
    dietType: "",
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prevSelectedCuisines) =>
      prevSelectedCuisines.includes(cuisine)
        ? prevSelectedCuisines.filter((c) => c !== cuisine)
        : [...prevSelectedCuisines, cuisine]
    );
  };

  const { user } = useAuth();
  const { setSerachData } = useRecipe();

  const navigate = useNavigate();

  const performSearch = () => {
    // const searchData = ;

    const queryParams = new URLSearchParams({
      query: searchTerm.trim(),
      user_id: user.user_id,
      cuisines: filterData.cuisines, // join array elements into a comma-separated string
      nutritional_match: filterData.nutritional_match,
      prepTime: filterData.prepTime,
      cookTime: filterData.cookTime,
      totalcookTime: filterData.totalcookTime,
      dietType,
    }).toString();

    axios
      .get(`http://127.0.0.1:5000/recipes/recommend?${queryParams}`)
      .then((response) => {
        setSerachData(response.data);
        navigate("/recommend/recipe");
      })
      .catch((error) => {
        console.error("Search failed:");
      });
  };

  const handleFilterSumbit = async (e) => {
    e.preventDefault();
    const formfilterData = {
      cuisines: selectedCuisines.join(","), // join array elements into a comma-separated string
      nutritional_match: nutritionalParameters,
      prepTime: prepTime === "" ? 0 : prepTime,
      cookTime: cookTime === "" ? 0 : cookTime,
      totalcookTime: totalcookTime === "" ? 0 : totalcookTime,
      dietType,
    };
    setFilterData(formfilterData);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search" // Corrected the type attribute
          value={searchTerm}
          onChange={handleSearchChange}
          className="block h-10 w-full pl-10 pr-28 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" // Adjusted the right padding
          placeholder="Search recipes"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-10 flex items-center pr-3 text-blue-500" // Moved the button left
          onClick={() => performSearch()}
          disabled={searchTerm.length > 2 ? false : true}
        >
          Search
        </button>
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={() => setIsDialogOpen(true)}
        >
          <AdjustmentsVerticalIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <Transition.Root show={isDialogOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-100 inset-0 overflow-hidden"
          onClose={setIsDialogOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={React.Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="absolute inset-0 bg-black bg-opacity-25 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Search Filters
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      {/* Cuisines accordion */}
                      <Disclosure as="div" className="pt-6">
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg px-4 py-2 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                              <span>Cuisines</span>
                              <ChevronUpIcon
                                className={`${
                                  open ? "transform rotate-180" : ""
                                } w-5 h-5 text-purple-500`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-4 pb-2">
                              <div className="max-h-40 overflow-y-auto">
                                {cuisines.sort().map((cuisine) => (
                                  <div
                                    key={cuisine}
                                    className="flex items-center mt-1"
                                  >
                                    <input
                                      id={`cuisine-option-${cuisine}`}
                                      name={`cuisine-option-${cuisine}`}
                                      type="checkbox"
                                      checked={selectedCuisines.includes(
                                        cuisine
                                      )}
                                      onChange={() => toggleCuisine(cuisine)}
                                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`cuisine-option-${cuisine}`}
                                      className="ml-3 text-sm text-gray-900"
                                    >
                                      {cuisine}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>

                      {/* Additional filters */}
                      <div className="mt-4">
                        <form className="mt-4" onSubmit={handleFilterSumbit}>
                          <label
                            htmlFor="prep-time"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Prep Time (minutes)
                          </label>
                          <input
                            id="prep-time"
                            type="number"
                            min="0"
                            value={prepTime}
                            onChange={(e) => setPrepTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter prep time"
                          />
                        </form>
                        <div className="mt-4">
                          <label
                            htmlFor="cook-time"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Cook Time (minutes)
                          </label>
                          <input
                            id="cook-time"
                            type="number"
                            min="0"
                            value={cookTime}
                            onChange={(e) => setCookTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter cook time"
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="cook-time"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Total Cook Time (minutes)
                          </label>
                          <input
                            id="total-cook-time"
                            type="number"
                            min="0"
                            value={totalcookTime}
                            onChange={(e) => setTotalcookTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter cook time"
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="diet-type"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Diet Type
                          </label>
                          <select
                            id="diet-type"
                            value={dietType}
                            onChange={(e) => setDietType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option value="">Select a diet type</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Non-Vegetarian">
                              Non-Vegetarian
                            </option>
                          </select>
                        </div>
                        <label
                          htmlFor="nutritional-parameters"
                          className="flex items-center mt-4"
                        >
                          <input
                            id="nutritional-parameters"
                            type="checkbox"
                            checked={nutritionalParameters}
                            onChange={() =>
                              setNutritionalParameters(!nutritionalParameters)
                            }
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-900">
                            Filter by Nutritional Values
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex-shrink-0 px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        className="w-full bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
                        onClick={() => {
                          // Implement the search with the selected filters
                          setIsDialogOpen(false);
                        }}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default SearchBarWithFilters;
