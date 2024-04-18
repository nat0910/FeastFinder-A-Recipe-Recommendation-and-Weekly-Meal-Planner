
from app.extension import db # Assuming this is the correct path
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import event
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.inspection import inspect
import numpy as np

from flask import current_app

class User(db.Model):
    __tablename__ = "users" 
    
    # Login Details of user
    user_id = db.Column(db.Integer, primary_key=True) 
    username = db.Column(db.String(64), index=True, nullable=True)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    onboarding  = db.Column(db.Boolean,nullable=False)

    # User Profile Details 
    age = db.Column(db.Integer, nullable=False)
    user_nutritional_cluster = db.Column(db.Integer, nullable=True)

    commonly_used_ingredients = db.Column(db.String(255), nullable=True)
    
    allergies = db.Column(db.String(255), nullable=True)

    preferred_cuisines = db.Column(db.String(255), nullable=True)
    preferred_prep_time = db.Column(db.Integer, nullable=True)
    preferred_cooking_time = db.Column(db.Integer, nullable=True)
    preferred_total_cooking_time = db.Column(db.Integer, nullable=True)

    diet_type = db.Column(db.String(50), nullable=True,index=True)
    
    # User Nutritional Values
    calories = db.Column(db.Float, nullable=True)
    fat_content = db.Column(db.Float, nullable=True)
    saturated_fat_content = db.Column(db.Float, nullable=True)
    cholesterol_content = db.Column(db.Float, nullable=True)
    sodium_content = db.Column(db.Float, nullable=True)
    carbohydrate_content = db.Column(db.Float, nullable=True)
    fiber_content = db.Column(db.Float, nullable=True)
    sugar_content = db.Column(db.Float, nullable=True)
    protein_content = db.Column(db.Float, nullable=True)

    meal_plans = db.relationship("MealPlan", order_by="MealPlan.meal_id", back_populates="user")
    archived_meal_plans = db.relationship("ArchivedMealPlan", order_by="ArchivedMealPlan.archived_meal_plan_id", back_populates="user")



    def set_password(self, password):
        self.password_hash = generate_password_hash(password) 
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

    def __repr__(self):
        return f"User {self.username}"

    def to_dict(self):
        user_dict = {
            'user_id': self.user_id,
            'username': self.username,
            'email': self.email,
            'age': self.age,
            'user_nutritional_cluster': self.user_nutritional_cluster,
            'allergies': self.allergies,
            'commonly_used_ingredients':self.commonly_used_ingredients,
            'preferred_cuisines': self.preferred_cuisines,
            'preferred_cooking_time': self.preferred_cooking_time,
            'diet_type':self.diet_type,
            'calories': self.calories,
            'fat_content': self.fat_content,
            'saturated_fat_content': self.saturated_fat_content,
            'cholesterol_content': self.cholesterol_content,
            'sodium_content': self.sodium_content,
            'carbohydrate_content': self.carbohydrate_content,
            'fiber_content': self.fiber_content,
            'sugar_content': self.sugar_content,
            'protein_content': self.protein_content
        }
        return user_dict
    
    @staticmethod
    def from_dict(user_dict):
        user = User(
            username=user_dict.get('username'),
            email=user_dict.get('email'),
            age=user_dict.get('age'),
            user_nutritional_cluster=user_dict.get('user_nutritional_cluster'),
            allergies=user_dict.get('allergies'),

            commonly_used_ingredients = user_dict.get('commonly_used_ingredients'),
            preferred_cuisines=user_dict.get('preferred_cuisines'),
            preferred_cooking_time=user_dict.get('preferred_cooking_time'),

            diet_type=user_dict.get('diet_type'),
            calories=user_dict.get('calories'),
            fat_content=user_dict.get('fat_content'),
            saturated_fat_content=user_dict.get('saturated_fat_content'),
            cholesterol_content=user_dict.get('cholesterol_content'),
            sodium_content=user_dict.get('sodium_content'),
            carbohydrate_content=user_dict.get('carbohydrate_content'),
            fiber_content=user_dict.get('fiber_content'),
            sugar_content=user_dict.get('sugar_content'),
            protein_content=user_dict.get('protein_content')
        )
        return user

