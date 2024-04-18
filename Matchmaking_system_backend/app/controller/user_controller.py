from flask_jwt_extended import (
    jwt_required, create_access_token, create_refresh_token,
    get_jwt_identity,jwt_required
)
from sqlalchemy.exc import SQLAlchemyError
from app.models.user_table_model import User
from app.extension import db
from flask import jsonify,current_app
import re
import numpy as np

def create_new_user(request):
    data = request.json
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    # Default values for age and diet_type
    age = data.get('age', 0)  # Example default age
    diet_type = data.get('diet_type', '')  # Example default diet type

    if not email or not password:
        return jsonify({'message': 'Incomplete information provided'}), 400

    if not re.match(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email):
        return jsonify({'message': 'Invalid email format'}), 400

    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already exists'}), 400

    new_user = User(
        username=username,
        email=email,
        onboarding=False,  # Default onboarding status is False
        age=age,
        diet_type=diet_type
    )
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create user due to database error', 'error': str(e)}), 500

    return jsonify({'message': 'User created successfully', 'user_id': new_user.user_id}), 201


def get_login(request):  
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Missing username/email or password'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not user.check_password(password):
            return jsonify({'error': 'Invalid password'}), 401

        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)

        UserData = {
           'user_id' : user.user_id,
           'email' : user.email,
           'isonboarding' : user.onboarding
        }
        return jsonify({'user':UserData,'access_token': access_token, 'refresh_token': refresh_token}), 200
    except SQLAlchemyError as e:
        return jsonify({'error': 'Database error', 'details': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Unexpected error', 'details': str(e)}), 500

def check_user_email(request):
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    if not re.match(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email):
        return jsonify({'message': 'Invalid email format'}), 400    

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'exists': True, 'message': 'Email is already registered'}), 200
    else:
        return jsonify({'exists': False, 'message': 'Email is not registered'}), 404


def reset_user_password(request):
    email = request.json.get('email')
    new_password = request.json.get('new_password')

    # Check if the email exists in the database
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Email not found'}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({'message': 'Password reset successful'}), 200

@jwt_required()
def get_refresh_token():
    try:
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return jsonify({'access_token': access_token}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to refresh token', 'details': str(e)}), 500


def store_onboarding_details(request):
    try:
        data = request.json

        user_id = data.get('user_id')
        if user_id is None:
            raise ValueError('User ID is required.')

              
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found!'}), 404

        # Check if onboarding is already completed
        if user.onboarding:
            return jsonify({'error': 'Onboarding already completed. No further updates allowed.'}), 403

        # Update user details
        user.allergies = data.get('allergies')
        user.commonly_used_ingredients = data.get('commonly_used_ingredients')

        user.preferred_cuisines = data.get('preferred_cuisines')
        user.preferred_prep_time = data.get('preferred_prep_time')
        user.preferred_cooking_time = data.get('preferred_cooking_time')
        user.preferred_total_cooking_time = data.get('preferred_total_cooking_time')

        user.calories = data['calories']
        user.fat_content = data['fat_content']
        user.cholesterol_content = data['cholesterol_content']
        user.sodium_content = data['sodium_content']
        user.carbohydrate_content = data['carbohydrate_content']
        user.fiber_content = data['fiber_content']
        user.sugar_content = data['sugar_content']
        user.protein_content = data['protein_content']

        user.onboarding = True

        db.session.commit()

        return jsonify({'message': 'User onboarding completed successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_user(user_id):
    # Retrieve the user from the database based on the user_id
    user = User.query.get(user_id)

    # Check if the user exists
    if user is None:
        # Return a 404 Not Found response if the user does not exist
        return jsonify({'error': 'User not found'}), 404

    # Serialize the user object to JSON
    user_data = user.to_dict()

    # Return the user data as JSON response
    return jsonify(user_data)


def edit_nutritional_data(request):
    try:
        # Get the user_id and nutritional values from the request JSON data
        data = request.json
        user_id = data.get('user_id')
        nutritional_values = {'commonly_used_ingredients','allergies','preferred_cuisines','preferred_prep_time','preferred_cooking_time','preferred_total_cooking_time',
            'calories', 'fat_content', 'saturated_fat_content', 'cholesterol_content', 
            'sodium_content', 'carbohydrate_content', 'fiber_content', 'sugar_content', 
            'protein_content'
        }
        
        # Query the database to find the user by user_id
        user = User.query.get(user_id)
        
        if user:
            # Update the user's nutritional values
            for key, value in data.items():
                if key in nutritional_values:
                    setattr(user, key, value)
            
            # Commit the changes to the database
            db.session.commit()
            
            return jsonify({'message': 'Nutritional values updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        db.session.rollback()  # Rollback in case of any error during the update
        return jsonify({'error': str(e)}), 500

def compute_cluster(user):
    try:
        scaler_model = current_app.trained_scaler_model
        kmeans_model = current_app.trained_kmeans_model

        user_values = np.array([[
            user.calories or 0, 
            user.fat_content or 0, 
            user.saturated_fat_content or 0,
            user.cholesterol_content or 0, 
            user.sodium_content or 0, 
            user.carbohydrate_content or 0,
            user.fiber_content or 0, 
            user.sugar_content or 0, 
            user.protein_content or 0
        ]])

        normalized_values = np.nan_to_num(user_values, nan=0.0)
        normalized_values = scaler_model.transform(normalized_values)
        cluster = kmeans_model.predict(normalized_values)[0]
        return cluster
    except Exception as e:
        current_app.logger.error(f"Error computing nutritional cluster: {e}")
        return None


def get_compute_cluster(request):
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "Missing user_id in request"}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        cluster = compute_cluster(user)
        if cluster is not None:
            # Convert the NumPy int32 to a native Python int to ensure compatibility
            cluster = int(cluster)
            # Update the user's nutritional cluster in the database
            user.user_nutritional_cluster = cluster
            db.session.add(user)  # Add the user object if not yet in the session (not typically necessary)
            db.session.commit()  # Commit the changes to the database

            return jsonify({"message":"User nutritional values updated"}), 200
        else:
            return jsonify({"error": "Failed to compute cluster"}), 500
    except Exception as e:
        current_app.logger.error(f"Failed to compute cluster for user {user_id}: {e}")
        db.session.rollback()  # Rollback in case of an error during update
        return jsonify({"error": str(e)}), 500
    
    
def get_user_preferences(user_id):
    try:
        # Fetch the user by ID
        user = User.query.get(user_id)
        
        # Check if the user exists
        if user:
            # Convert the user object to a dictionary
            user_preferences = {
                'user_id': user.user_id,
                "allergies": user.allergies,
                "commonly_used_ingredients":user.commonly_used_ingredients,
                'preferred_cuisines': user.preferred_cuisines,
                'preferred_prep_time': user.preferred_prep_time,
                'preferred_cooking_time': user.preferred_cooking_time,
                'preferred_total_cooking_time': user.preferred_total_cooking_time,
                'diet_type': user.diet_type,
                'calories': user.calories,
                'fat_content': user.fat_content,
                'saturated_fat_content': user.saturated_fat_content,
                'cholesterol_content': user.cholesterol_content,
                'sodium_content': user.sodium_content,
                'carbohydrate_content': user.carbohydrate_content,
                'fiber_content': user.fiber_content,
                'sugar_content': user.sugar_content,
                'protein_content': user.protein_content
            }
            
            return jsonify(user_preferences), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        # Log and return an error response if something goes wrong
        current_app.logger.error(f'Failed to fetch user preferences: {str(e)}')
        return jsonify({'error': 'Failed to fetch user preferences'}), 500