import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const RecipeContext = createContext();

const baseUrl = "http://127.0.0.1:5000";

export default function RecipeProvider({ children }) {
  const [tailoredList, setTailoredList] = useState([]);
  const [Curated, setCurated] = useState([]);
  const [serachData, setSerachData] = useState([]);
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isErrorCur, setIsErrorCur] = useState(false);

  useEffect(() => {
    if (user && user.user_id) {
      async function fetchTailoredRecipe() {
        if (isError === false) {
          try {
            const response = await axios.get(
              `${
                import.meta.env.VITE_BACKEND_BASE_API_URL
              }/recipes/tailored-for-you?user_id=${user.user_id}`
            );
            if (response.data.length === 0) {
              setIsError(true);
            }

            setTailoredList(response.data);
          } catch (error) {
            setIsError(true);
            console.error("Error fetching tailored recipes:");
          }
        } else if (isError == true) {
          try {
            const response = await axios.get(
              `${
                import.meta.env.VITE_BACKEND_BASE_API_URL
              }/recipes/tailored-recipes?user_id=${user.user_id}`
            );
            setTailoredList(response.data);
          } catch (error) {
            console.error("Error fetching curated recipes:");
          }
        }
      }

      fetchTailoredRecipe();
    }
  }, [user?.user_id, isError]); // Using optional chaining to avoid errors if user is undefined

  useEffect(() => {
    if (user && user.user_id) {
      async function fetchCuratedRecipe() {
        if (isErrorCur == false) {
          try {
            const response = await axios.get(
              `${
                import.meta.env.VITE_BACKEND_BASE_API_URL
              }/recipes/curated_by_cuisine?user_id=${user.user_id}`
            );
            if (response.data.length === 0) {
              setIsErrorCur(true);
            }
            setCurated(response.data);
          } catch (error) {
            setIsErrorCur(true);
            console.error("Error fetching curated recipes:");
          }
        } else if (isErrorCur === true) {
          {
            try {
              const response = await axios.get(
                `${
                  import.meta.env.VITE_BACKEND_BASE_API_URL
                }/recipes/curated-recipes?user_id=${user.user_id}`
              );

              setCurated(response.data);
            } catch (error) {
              console.error("Error fetching curated recipes:");
            }
          }
        }
      }

      fetchCuratedRecipe();
    }
  }, [user?.user_id, isErrorCur]);

  useEffect(() => {
    if (user && user.user_id) {
      async function fetchWeeklyMealPlan() {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_BASE_API_URL
            }/meal-plan/weekly-meal/${user.user_id}`
          );
          setWeeklyData(response.data);
        } catch (error) {
          console.error("Error fetching curated recipes:");
        }
      }

      fetchWeeklyMealPlan();
    }
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <RecipeContext.Provider
      value={{ weeklyData, tailoredList, Curated, serachData, setSerachData }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipe() {
  return useContext(RecipeContext);
}
