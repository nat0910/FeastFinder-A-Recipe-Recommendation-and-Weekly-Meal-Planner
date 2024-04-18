from flask import Flask
from .extension import setup_extensions,db
from .routes import user_routes,recipe_routes,meal_plan_routes,archive_meal_plan_routes
from .models import recipe_table_model,user_table_model
from apscheduler.schedulers.background import BackgroundScheduler
from .controller.meal_plan_controller import schedule_meal_plans
from .controller.archive_meal_plan_controller import archive_meal_plans

import pandas as pd
import ast

def parse_list_string(list_string):
    try:
        return ast.literal_eval(list_string)
    except (ValueError, SyntaxError):
        return []

def insert_data_if_needed():
    if not recipe_table_model.Recipe.query.first():  # Check if the Recipe table is empty
        print("No data found in the database. Inserting data...")
        df = pd.read_csv('recommendation_dataset_update.csv')  # Adjust the path as necessary
        for _, row in df.iterrows():
            recipe = recipe_table_model.Recipe(
                recipe_id=row["RecipeId"],
                recipe_name=row['Name'],
                recipe_category=row['RecipeCategory'],
                recipe_description=row['Description'],
                recipe_images=row['Images'],
                calories=row['Calories'],
                fat_content=row['FatContent'],
                saturated_fat_content=row['SaturatedFatContent'],
                cholesterol_content=row['CholesterolContent'],
                sodium_content=row['SodiumContent'],
                carbohydrate_content=row['CarbohydrateContent'],
                fiber_content=row['FiberContent'],
                sugar_content=row['SugarContent'],
                protein_content=row['ProteinContent'],
                cook_time=row['CookTime (mins)'],
                prep_time=row['PrepTime (mins)'],
                total_time=row['TotalTime (mins)'],
                keywords=row['Keywords (list)'],
                recipe_ingredients=row['RecipeIngredients (list)'],
                recipe_instructions=row['RecipeInstructions (list)'],
                diet_type=row['DietType'],
                nutritional_cluster=row['nutritional_cluster'],
                allergy_type=row['allergy_type'],
                cuisine=row['Cuisine']
            )
            db.session.add(recipe)
        try:
            db.session.commit()
            print("Data loaded successfully.")
        except Exception as e:
            db.session.rollback()
            print(f"An error occurred while inserting the data: {e}")

def create_app():
    app = Flask(__name__,instance_relative_config=True)
    app.config.from_pyfile('config.py')
    print("Database URI:", app.config['SQLALCHEMY_DATABASE_URI']) 
    print(f"Config loaded:, SECRET_KEY: {app.config.get('SECRET_KEY')}")
    setup_extensions(app)

    with app.app_context():
        db.create_all()
        insert_data_if_needed()

    scheduler = BackgroundScheduler()
    scheduler.start()
    scheduler.add_job(func=schedule_meal_plans, trigger='cron', day_of_week='sun', hour=23, minute=30, id='weekly_meal_plan')
    scheduler.add_job(func=archive_meal_plans, trigger='cron', day='last', hour=23, minute=59, id='monthly_meal_plan_archiving')

# Run the Flask app


    app.register_blueprint(user_routes.user_blueprint,url_prefix='/user')
    app.register_blueprint(recipe_routes.recipes_blueprint,url_prefix='/recipes')
    app.register_blueprint(meal_plan_routes.meal_plan_blueprint,url_prefix='/meal-plan')
    app.register_blueprint(archive_meal_plan_routes.archive_meal_plan_blueprint,url_prefix='/archive-meal-plan')



    return app

