import {
  ClockIcon,
  FireIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const WeeklyMealPlan = ({ data }) => {
  const parsedPlan = JSON.parse(data);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-base sm:text-2xl font-semibold">
          Weekly Meal Plan
        </h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1">
            {Object.entries(parsedPlan).map(([day, meals]) => (
              <div
                key={day}
                className="bg-white p-2 "
                style={{ minWidth: "220px", maxWidth: "250px" }}
              >
                <h3 className="text-sm font-medium truncate">{day}</h3>
                <div className="space-y-2 mt-2">
                  {Object.entries(meals).map(([mealTime, details]) => (
                    <div key={mealTime} className="border p-2 rounded text-xs">
                      <Link to={`/recipe/${details.recipe_id}`}>
                        <h4 className="font-medium truncate">
                          {details.recipe_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-3 pb-2">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-gray-500" />
                            <span className="ml-1">
                              {details.total_time} mins
                            </span>
                          </div>
                          {isNaN(details.calories) ? (
                            <></>
                          ) : (
                            <div className="flex items-center">
                              <FireIcon className="h-4 w-4 text-gray-500" />
                              <span className="ml-1">
                                {details.calories} kcal
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WeeklyMealPlan;
