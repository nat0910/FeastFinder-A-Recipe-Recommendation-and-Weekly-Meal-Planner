from app.models.meal_table_model import MealPlan
from app.models.archive_meal_table_model import ArchivedMealPlan
from app.extension import db
from datetime import datetime,timedelta
from flask import abort

from sqlalchemy.exc import SQLAlchemyError

def archive_meal_plans(unit='days', value=30):
    try:
        if unit == 'days':
            # Define the threshold date (e.g., one month ago)
            threshold_date = datetime.now() - timedelta(days=value)
        elif unit == 'minutes':
            # Define the threshold date for minutes (e.g., 2 minutes ago)
            threshold_date = datetime.now() - timedelta(minutes=value)
        else:
            raise ValueError("Invalid unit. Only 'days' and 'minutes' are supported.")

        # Query meal plans older than the threshold date
        meal_plans_to_archive = MealPlan.query.filter(MealPlan.created_at < threshold_date).all()

        # Archive each meal plan and mark it for deletion
        meal_plans_to_delete = []
        for meal_plan in meal_plans_to_archive:
            # Create an ArchivedMealPlan object
            archived_meal_plan = ArchivedMealPlan(
                meal_id=meal_plan.meal_id,
                user_id=meal_plan.user_id,
                plan_data=meal_plan.plan_data,
                created_at=meal_plan.created_at
            )

            # Add the archived meal plan to the session
            db.session.add(archived_meal_plan)

            # Mark the original meal plan for deletion
            meal_plans_to_delete.append(meal_plan)

        # Delete the original meal plans
        for meal_plan in meal_plans_to_delete:
            db.session.delete(meal_plan)

        # Commit the changes to the database
        db.session.commit()
        
        return True, None  # Successful archiving with no error
    except ValueError as ve:
        return False, str(ve)  # Invalid unit error
    except SQLAlchemyError as se:
        db.session.rollback()  # Rollback changes in case of database error
        return False, f"Database error: {str(se)}"  # Database error
    except Exception as e:
        return False, f"An unexpected error occurred: {str(e)}"  # Unexpected error
    

def get_archived_meal_plans(user_id):
    try:
        archived_meal_plans = ArchivedMealPlan.query.filter_by(user_id=user_id).order_by(ArchivedMealPlan.created_at.desc()).all()

        # Dictionary to hold meal plans divided by month and year
        meal_plans_by_month_year = {}

        for meal_plan in archived_meal_plans:
            # Extract month and year from the created_at timestamp
            month_year = f"{meal_plan.created_at.strftime('%Y-%m')}"
            
            # Check if the month_year key exists in the dictionary, if not, create it
            if month_year not in meal_plans_by_month_year:
                meal_plans_by_month_year[month_year] = []

            # Append the meal plan data to the corresponding month and year
            meal_plans_by_month_year[month_year].append({
                'user_id': meal_plan.user_id,
                'created_at': meal_plan.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'weekly_plan': meal_plan.plan_data
            })

        return meal_plans_by_month_year

    except Exception as e:
        print(f"Error fetching archived meal plans: {str(e)}")
        abort(404)
