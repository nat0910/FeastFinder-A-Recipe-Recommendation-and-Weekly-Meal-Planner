from app.models import user_table_model,meal_table_model,recipe_table_model
from flask import abort,current_app,jsonify
from app.extension import db
import json
from datetime import datetime
from sqlalchemy import func
import random
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Optional,Any,NoReturn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

User = user_table_model.User
MealPlan = meal_table_model.MealPlan
Recipe = recipe_table_model.Recipe

def fetch_recipes_meal_plan(user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    try:
        recipe_query = db.session.query(Recipe)

        if 'diet_type' in user_profile and user_profile['diet_type'].strip():
            recipe_query = recipe_query.filter(Recipe.diet_type == user_profile['diet_type'])

        if 'nutritional_cluster' in user_profile:
            recipe_query = recipe_query.filter(Recipe.nutritional_cluster == user_profile['nutritional_cluster'])

        if 'allergies' in user_profile and user_profile['allergies']:
            allergies = [allergy.strip().lower() for allergy in user_profile['allergies'].split(',')]
            recipe_query = recipe_query.filter(~func.lower(Recipe.allergy_type).in_(allergies))

        if 'preferred_cuisines' in user_profile and user_profile['preferred_cuisines']:
            preferred_cuisines = [cuisine.strip().lower() for cuisine in user_profile['preferred_cuisines'].split(',')]
            recipe_query = recipe_query.filter(~func.lower(Recipe.keywords).in_(preferred_cuisines))

        if 'preferred_total_cooking_time' in user_profile:
            recipe_query = recipe_query.filter(Recipe.total_time <= user_profile['preferred_total_cooking_time'])

        return recipe_query.all()
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during recipe fetching: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during recipe fetching: {str(e)}")
        abort(500, description="An unexpected error occurred.")

def generate_weekly_meal_plan(user_profile: Dict[str, Any]) -> Dict[str, Dict[str, Optional[Dict[str, Any]]]]:
    try:
        if not user_profile:
            raise ValueError("User profile must be provided.")

        # Define days of the week and meal types
        days_of_week: List[str] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        meal_types: List[str] = ["breakfast", "lunch/snack"]

        # Fetch filtered recipes from the database based on user profile
        recipes: List[Dict[str, Any]] = fetch_recipes_meal_plan(user_profile)
        if not recipes:
            current_app.logger.info("No recipes found matching the user profile criteria.")
            return {day: {meal: None for meal in meal_types + ["dinner"]} for day in days_of_week}

        # Organize recipes by meal type for easier access
        filtered_recipes: Dict[str, List[Dict[str, Any]]] = {
            meal: [
                {
                    "recipe_name": recipe.recipe_name,
                    "recipe_id": recipe.recipe_id,
                    "ingredients": recipe.recipe_ingredients,
                    "total_time": recipe.total_time,
                    "cook_time": recipe.cook_time,
                    "prep_time": recipe.prep_time,
                    "keywords": recipe.keywords,
                    "calories" : recipe.calories
                }
                for recipe in recipes 
                if recipe.recipe_category and meal.lower() in recipe.recipe_category.lower()
            ] 
            for meal in meal_types
        }

        # Define extensive list for dinner options
        dinner_options: List[str] = ["Vegetable", "Chicken", "Meat", "Pork", "Sauces", "Chicken Breast", "Potato", "Cheese", "Pie",
        "Bar Cookie", "Low Protein", "Drop Cookies", "Yeast Breads", "Candy", "Frozen Desserts", "Spreads",
        "Poultry", "Cheesecake", "Low Cholesterol", "European", "Very Low Carbs", "Steak", "Curries",
        "Chowders", "Asian", "Punch Beverage", "Mexican", "Spaghetti", "Healthy", "Greens", "Clear Soup",
        "Tarts", "Gelatin", "Peppers", "Weeknight", "Apple", "Scones", "High Protein", "Penne", "Shakes",
        "Kid Friendly", "Pineapple", "Easy", "Brunch", "For Large Groups", "Lemon", "Oranges",
        "Chinese", "Veal", "Strawberry", "Berries", "Halibut", "Gumbo", "Cajun", "Chutneys",
        "Potluck", "Summer", "Thai", "Meatloaf", "Jellies", "Canadian", "Lactose Free", "Nuts", "Christmas",
        "Tilapia", "Meatballs", "Australian", "Deer", "Mussels", "Savory", "Lobster", "Southwest Asia (middle East)",
        "Japanese", "Melons", "Mango", "Southwestern U.S.", "Catfish", "Ice Cream", "Toddler Friendly", "African",
        "Spanish", "Macaroni And Cheese", "Spicy", "Winter", "Tropical Fruits", "Citrus", "German", "Indian",
        "Caribbean", "Pakistani", "Creole", "Pears", "Chocolate Chip Cookies", "Trout", "Oatmeal", "Oven",
        "Wild Game", "Manicotti", "Moroccan", "Raspberries", "Crawfish", "Collard Greens", "Squid", "Mahi Mahi",
        "Kosher", "Lime", "Bass", "Pumpkin", "Homeopathy/Remedies", "Cherries", "Avocado", "Chard", "Spring",
        "Vietnamese", "Russian", "Duck Breasts", "Korean", "Whole Duck", "Sweet", "Orange Roughy", "Peanut Butter",
        "Portuguese", "Rabbit", "Scandinavian", "Broil/Grill", "High Fiber", "Halloween", "Hawaiian", "Plums",
        "Filipino", "Papaya", "Turkish", "Lebanese", "Tempeh", "Quail", "Scottish", "New Zealand", "Pheasant",
        "Brazilian", "South African", "No Shell Fish", "Swedish", "Native American", "Camping", "Szechuan", "Canning",
        "Stove Top", "Swiss", "Goose", "Malaysian", "Grapes", "Indonesian", "Danish", "Polynesian", "Puerto Rican",
        "Egyptian", "Octopus", "Ethiopian", "Elk", "Perch", "Birthday", "Nepalese", "Kiwifruit", "Czech", "Freezer",
        "Moose", "Colombian", "Finnish", "Palestinian", "Belgian", "Bear", "Roast", "Hunan", "Icelandic", "Beef Liver",
        "No Cook", "Nigerian", "Memorial Day", "Costa Rican", "Hanukkah", "Somalian", "Fish Tuna", "Roast Beef Crock Pot",
        "Soups Crock Pot", "Dairy Free Foods", "Gluten Free Appetizers", "Fish Salmon", "Snacks Sweet", "Apple Pie",
        "Labor Day"
    ]

        # Fetch recipes specifically for dinner based on dinner options
        dinner_recipes: List[Dict[str, Any]] = [
            {
                  "recipe_name": recipe.recipe_name,
                    "recipe_id": recipe.recipe_id,
                    "ingredients": recipe.recipe_ingredients,
                    "total_time": recipe.total_time,
                    "cook_time": recipe.cook_time,
                    "prep_time": recipe.prep_time,
                    "keywords": recipe.keywords,
                    "calories" : recipe.calories
            }
            for recipe in recipes 
            if recipe.recipe_category and any(option.lower() in recipe.recipe_category.lower() for option in dinner_options)
        ]

        # Dictionary to store the meal plan
        weekly_plan: Dict[str, Dict[str, Optional[Dict[str, Any]]]] = {day: {meal: None for meal in meal_types + ["dinner"]} for day in days_of_week}

        # Assign meals for each day
        for day, meals in weekly_plan.items():
            for meal_type in meals:
                if meal_type == "dinner":
                    if dinner_recipes:
                        chosen_dinner_recipe: Dict[str, Any] = random.choice(dinner_recipes)
                        weekly_plan[day][meal_type] = chosen_dinner_recipe
                else:
                    if filtered_recipes.get(meal_type):
                        chosen_recipe: Optional[Dict[str, Any]] = random.choice(filtered_recipes[meal_type])
                        weekly_plan[day][meal_type] = chosen_recipe

        return weekly_plan
    except ValueError as e:
        current_app.logger.error(f"Validation error: {str(e)}")
        abort(400, description=str(e))
    except Exception as e:
        current_app.logger.error(f"Failed to generate weekly meal plan: {str(e)}")
        abort(500, description="An internal error occurred while generating the meal plan.")

def fetch_all_users() -> List[int]:
    try:
        # Fetch all user IDs from the database
        user_ids: List[int] = [user.user_id for user in User.query.all()]
        return user_ids
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during fetching all users: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during fetching all users: {str(e)}")
        abort(500, description="An unexpected error occurred.")

def fetch_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
    try:
        if not isinstance(user_id, int):
            raise ValueError("User ID must be an integer.")

        # Fetch the user profile based on user_id
        user = User.query.filter_by(user_id=user_id).first()
        return user.to_dict() if user else None
    except ValueError as e:
        current_app.logger.error(f"Input validation error: {str(e)}")
        abort(400, description=str(e))  # Bad request error
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error when fetching user profile: {str(e)}")
        abort(500, description="Internal server error during database query.")  # Internal server error
    except Exception as e:
        current_app.logger.error(f"Unexpected error when fetching user profile: {str(e)}")
        abort(500, description="An unexpected error occurred.")  # Catch-all for any other unexpected issues

def generate_and_store_meal_plan(user_id: int) -> Any:
    try:
        # Validate the user ID
        if not isinstance(user_id, int):
            raise ValueError("User ID must be an integer.")

        # Fetch the user profile
        user_profile = fetch_user_profile(user_id)
        if user_profile is None:
            raise ValueError(f"No profile found for user ID {user_id}")

        # Generate the meal plan based on the user's profile
        meal_plan = generate_weekly_meal_plan(user_profile)
        if meal_plan is None:
            raise ValueError("Failed to generate a meal plan.")

        # Serialize the meal plan to JSON
        plan_data = json.dumps(meal_plan)

        # Create a new meal plan entry
        new_plan = MealPlan(user_id=user_id, plan_data=plan_data)
        db.session.add(new_plan)
        db.session.commit()

        return jsonify({"message": "Meal plan stored successfully.", "meal_plan": meal_plan}), 200
    except ValueError as e:
        current_app.logger.error(f"Input or process validation error: {str(e)}")
        abort(400, description=str(e))  # Return a 400 Bad Request response
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error when storing meal plan: {str(e)}")
        db.session.rollback()  # Roll back the session to avoid any half-committed states
        abort(500, description="Database error during operation.")  # Return a 500 Internal Server Error
    except Exception as e:
        current_app.logger.error(f"Unexpected error during meal plan storage: {str(e)}")
        abort(500, description="An unexpected error occurred.")


def schedule_meal_plans() -> NoReturn:
    try:
        logging.info("Scheduling meal plans at %s", datetime.now())

        user_ids = fetch_all_users()
        if not user_ids:
            logging.info("No users found to schedule meal plans for.")
            return

        failed_users = []
        for user_id in user_ids:
            try:
                generate_and_store_meal_plan(user_id)
            except Exception as e:
                logging.error("Failed to generate and store meal plan for user %d: %s", user_id, str(e))
                failed_users.append(user_id)
                # Optionally, handle retry logic here or mark the failure for later review

        if failed_users:
            logging.warning("Meal plans failed for some users: %s", failed_users)
        logging.info("Meal plans scheduled successfully for all other users.")
    except SQLAlchemyError as e:
        logging.critical("Database error during scheduling meal plans: %s", str(e))
        # Consider re-raising or specific recovery steps here
    except Exception as e:
        logging.critical("Unexpected error during scheduling of meal plans: %s", str(e))
        # Depending on the application, you might want to raise an exception here or notify a monitoring service


def setting_meal_plan_new_user(user_id: int) -> Any:
    try:
        # Validate the input to make sure it's an integer
        if not isinstance(user_id, int):
            raise ValueError("The user ID must be an integer.")

        # Attempt to generate and store the meal plan
        generate_and_store_meal_plan(user_id)
        return jsonify({"message": f"Weekly meal plans created successfully for user {user_id}."}), 200
    except ValueError as e:
        current_app.logger.error(f"Input validation error: {str(e)}")
        return jsonify({"error": str(e)}), 400  # Bad request response
    except Exception as e:
        current_app.logger.error(f"Unexpected error while setting meal plan for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to create meal plan due to an unexpected error."}), 500
    
# Gets Users Weekly Meal Plan
def get_weekly_meal_plan(user_id: int) -> Dict[str, Any]:
    try:
        # Ensure user_id is an integer
        if not isinstance(user_id, int):
            current_app.logger.error("Invalid user ID type provided, must be an integer.")
            abort(400, description="Invalid user ID provided.")

        # Attempt to retrieve the latest meal plan for the user
        weekly_meal_plan = MealPlan.query.filter_by(user_id=user_id).order_by(MealPlan.created_at.desc()).first_or_404(description=f"No meal plan found for user ID {user_id}")

        # Construct the meal plan data to be returned
        meal_plan_data = {
            'user_id': weekly_meal_plan.user_id,
            'weekly_plan': weekly_meal_plan.plan_data
        }
        return meal_plan_data

    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error when fetching meal plan: {str(e)}")
        abort(500, description="Database error when retrieving the meal plan.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error when fetching meal plan for user {user_id}: {str(e)}")
        abort(500, description="An unexpected error occurred.")


        