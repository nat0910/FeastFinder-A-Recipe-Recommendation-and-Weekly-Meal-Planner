from app.models.recipe_table_model import Recipe
from app.models.user_table_model import User
from app.extension import db
from flask import current_app,abort
from typing import List, Dict, Any,Optional
from app.utils.utils import preprocess_recipe_name
from sqlalchemy.orm import load_only
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from app.controller.meal_plan_controller import fetch_recipes_meal_plan,fetch_user_profile

def get_recipe_name_recommendation(user_input: str) -> List[Dict[str, Any]]:
    try:
        vectorizer = current_app.trained_recipe_name_tdidf
        svd = current_app.trained_recipe_name_svd
        annoy_index = current_app.trained_recipe_name_model

        user_input_preprocess = preprocess_recipe_name(user_input)
        user_input_vector = vectorizer.transform([user_input_preprocess])[0]
        user_input_vector_svd = svd.transform(user_input_vector)
        n_nearest_neighbors = 25
        nearest_ids = annoy_index.get_nns_by_vector(user_input_vector_svd[0], n_nearest_neighbors, include_distances=False) 
        

        recipes = Recipe.query.filter(Recipe.recipe_id.in_(nearest_ids)).options(load_only(*Recipe.fields_to_load())).all()

        recipe_dict = {recipe.recipe_id: recipe.to_dict() for recipe in recipes}
        sorted_recipes = [recipe_dict[recipe_id] for recipe_id in nearest_ids if recipe_id in recipe_dict]

        return sorted_recipes
    except Exception as e:
        current_app.logger.error(f'Failed to get recipe recommendations: {str(e)}')
        abort(500, description="Failed to process the recipe recommendations.")

def get_key_ingred_combine_recommendation(
    user_input: str ="",
    nnn:int = 75,
    prep_time= "",
    cook_time= "",
    total_time= "",
    cuisines: str = "",
    diet_type: str = "",
    user_nutritional_cluster: Optional[int] = None
) -> List[Dict[str, Any]]:
    try:
        vectorizer = current_app.trained_key_ingred_tdidf
        svd = current_app.trained_key_ingred_svd
        annoy_index = current_app.trained_ann_key_ingred_model
        user_input_vector = vectorizer.transform([user_input+cuisines])[0]
        user_input_vector_svd = svd.transform(user_input_vector)
        n_nearest_neighbors = nnn
        nearest_ids = annoy_index.get_nns_by_vector(user_input_vector_svd[0], n_nearest_neighbors, include_distances=False)

        base_query = Recipe.query.filter(Recipe.recipe_id.in_(nearest_ids))

        recipes = base_query.options(load_only(*Recipe.fields_to_load())).all()

    # Apply time filtersx
        filtered_recipes = []
        for recipe in recipes:
            # Filter by prep_time, cook_time, and total_time
            if prep_time > 0 and recipe.prep_time > prep_time:
                continue
            if cook_time > 0 and recipe.cook_time > cook_time:
                continue
            if total_time > 0 and recipe.total_time > total_time:
                continue
            
            # Filter by diet_type
            if diet_type and recipe.diet_type != diet_type:
                continue
            
            # Filter by user_nutritional_cluster if provided
            if user_nutritional_cluster is not None and recipe.nutritional_cluster != user_nutritional_cluster:
                continue
            
            filtered_recipes.append(recipe)
       
        return [recipe.to_dict() for recipe in filtered_recipes]
    except Exception as e:
        current_app.logger.error(f'Failed to get ingredient combination recommendations: {str(e)}')
        current_app.logger.debug(f'prep_time: {prep_time} ({type(prep_time)})')
        current_app.logger.debug(f'cook_time: {cook_time} ({type(cook_time)})')
        current_app.logger.debug(f'total_time: {total_time} ({type(total_time)})')
        abort(500, description="Failed to process the ingredient combination recommendations.")

def get_recipe_from_id(recipe_id: int):
    try:
        # Query the recipe from the database using the provided ID
        recipe = Recipe.query.get_or_404(recipe_id)
        return recipe.to_dict()
    except Exception as e:
        current_app.logger.error(f'Recipe not found or error retrieving it: {str(e)}')
        abort(404, description=f"Recipe with ID {recipe_id} not found.")

def fetch_recipes_trailor(user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    try:
        recipe_query = db.session.query(Recipe)

        if 'diet_type' in user_profile and user_profile['diet_type'].strip():
            recipe_query = recipe_query.filter(Recipe.diet_type == user_profile['diet_type'])

        if 'nutritional_cluster' in user_profile and user_profile['nutritional_cluster'] is not None:
            recipe_query = recipe_query.filter(Recipe.nutritional_cluster == user_profile['nutritional_cluster'])

        if 'allergies' in user_profile and user_profile['allergies']:
            allergies = [allergy.strip().lower() for allergy in user_profile['allergies'].split(',')]
            recipe_query = recipe_query.filter(~func.lower(Recipe.allergy_type).in_(allergies))

        if 'preferred_total_cooking_time' in user_profile:
            recipe_query = recipe_query.filter(Recipe.total_time <= user_profile['preferred_total_cooking_time'])

        return recipe_query.limit(10)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during recipe fetching: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during recipe fetching: {str(e)}")
        abort(500, description="An unexpected error occurred.")

def get_tailored_recipe(request):
    user_id = request.args.get('user_id')
    user_profile = fetch_user_profile(int(user_id))

    recipeLists = fetch_recipes_trailor(user_profile)
    recipe_dicts = [recipe.to_dict() for recipe in recipeLists]
    return recipe_dicts


def fetch_recipes_cuisine(user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    try:
        recipe_query = db.session.query(Recipe)
        if 'preferred_cuisines' in user_profile and user_profile['preferred_cuisines']:
            preferred_cuisines = [cuisine.strip().lower() for cuisine in user_profile['preferred_cuisines'].split(',')]
            recipe_query = recipe_query.filter(~func.lower(Recipe.keywords).in_(preferred_cuisines))

        return recipe_query.limit(25)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during recipe fetching: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during recipe fetching: {str(e)}")
        abort(500, description="An unexpected error occurred.")


def get_curated_cusinie(request):
    user_id = request.args.get('user_id')
    user_profile = fetch_user_profile(int(user_id))
    recipeLists = fetch_recipes_cuisine(user_profile)
    recipe_dicts = [recipe.to_dict() for recipe in recipeLists]
    return recipe_dicts[12:]


def get_recipes_by_category(request):
    category = request.args.get('category')
    if not category:
        return {'error': 'Category parameter is required'}, 400

    try:
        # Fetch recipes filtered by the provided category
        recipes = Recipe.query.filter_by(recipe_category=category).limit(40)

        # Convert recipes to dictionary format 
        recipe_dicts = [recipe.to_dict() for recipe in recipes]

        return recipe_dicts

    except Exception as e:
        return {'error': str(e)}, 500


def tailored_recipe_recommendation(request):
    user_id = request.args.get('user_id')
    user_profile = fetch_user_profile(int(user_id))
    commonly_used_ingredients = user_profile.get('commonly_used_ingredients', '')  # Retrieve commonly used ingredients from the user profile

    # Get specific user parameters from user_profile
    prep_time = user_profile.get('prep_time', 0)
    cook_time = user_profile.get('cook_time', 0)
    total_time = user_profile.get('total_time', 0)
    cuisines = user_profile.get('preferred_cuisines', '')
    diet_type = user_profile.get('diet_type', '')
    user_nutritional_cluster = user_profile.get('nutritional_cluster', None)


    recipe_lists = get_key_ingred_combine_recommendation(
        diet_type=diet_type,
        cuisines=cuisines,
        nnn=100,
        user_nutritional_cluster=user_nutritional_cluster
    )
    return recipe_lists


def fetch_tailored_user_profile(user_id: int) -> Optional[Dict[str, Any]]:
    try:
        if not isinstance(user_id, int):  # Ensures that the user_id is an integer
            raise ValueError("User ID must be an integer.")

        # Fetch the user profile from the database
        user = User.query.filter_by(user_id=user_id).first()  # Adjust the attribute if it's not user_id but id or something else in your database schema
        if user is None:
            current_app.logger.info(f"No profile found for user ID: {user_id}")  # Logging no profile found
            return None  # Return None if no user profile was found
        return user.to_dict()  # Convert the SQLAlchemy model instance into a dictionary

    except ValueError as e:
        current_app.logger.error(f"Input validation error: {str(e)}")
        abort(400, description=str(e))  # Returns a 400 Bad Request if input validation fails

    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error when fetching user profile: {str(e)}")
        abort(500, description="Internal server error during database query.")  # Returns a 500 Internal Server Error if there's a database issue

    except Exception as e:
        current_app.logger.error(f"Unexpected error when fetching user profile: {str(e)}")
        abort(500, description="An unexpected error occurred.")  # Generic catch-all for other exceptions



def get_user_tailored_recipe(request):
    user_id = request.args.get('user_id')
    user_profile = fetch_tailored_user_profile(int(user_id))

    try:
        # Fetching tailored recipes based on the user's profile and preferences
        recipe_dicts = get_key_ingred_combine_recommendation(
            user_input=user_profile.get("commonly_used_ingredients",""),  # Add relevant user input if needed
            nnn=15,  # Number of nearest neighbors to fetch
            prep_time = user_profile.get('prep_time', 0),
            cook_time = user_profile.get('cook_time', 0),
            total_time = user_profile.get('total_time', 0),
            cuisines = user_profile.get('preferred_cuisines'),
            diet_type = user_profile.get('diet_type', ''),
            user_nutritional_cluster = user_profile.get('nutritional_cluster', None)
        )
        return recipe_dicts
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during recipe fetching: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during recipe fetching: {str(e)}")
        abort(500, description="An unexpected error occurred.")



def get_user_curated_cusinie(request):
    user_id = request.args.get('user_id')
    user_profile = fetch_tailored_user_profile(int(user_id))

    try:
        # Fetching tailored recipes based on the user's profile and preferences
        recipe_dicts = get_key_ingred_combine_recommendation(
            user_input=user_profile.get('preferred_cuisines'),  # Add relevant user input if needed
            nnn=50,  # Number of nearest neighbors to fetch
            prep_time = user_profile.get('prep_time', 0),
            cook_time = user_profile.get('cook_time', 0),
            total_time = user_profile.get('total_time', 0),
            cuisines = user_profile.get('preferred_cuisines',''),
            diet_type = user_profile.get('diet_type', ''),
            user_nutritional_cluster = user_profile.get('nutritional_cluster', None)
        )
        return recipe_dicts
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error during recipe fetching: {str(e)}")
        abort(500, description="Internal server error during database query.")
    except Exception as e:
        current_app.logger.error(f"Unexpected error during recipe fetching: {str(e)}")
        abort(500, description="An unexpected error occurred.")
