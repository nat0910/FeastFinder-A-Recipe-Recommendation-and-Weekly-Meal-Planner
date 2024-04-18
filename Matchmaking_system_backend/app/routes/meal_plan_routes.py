from flask import Blueprint, jsonify, request
from app.controller.meal_plan_controller import schedule_meal_plans, get_weekly_meal_plan, setting_meal_plan_new_user

meal_plan_blueprint = Blueprint('meal_plan', __name__)

# Retrieve the weekly meal plan for a given user.
@meal_plan_blueprint.route('/weekly-meal/<int:user_id>', methods=['GET'])
def handle_get_weekly_meal(user_id: int):
    try:
        meal_plan = get_weekly_meal_plan(user_id)
        if meal_plan is None:
            return jsonify({"error": "Meal plan not found"}), 404
        return jsonify(meal_plan), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Manually triggers the process to schedule meal plans for all users.
@meal_plan_blueprint.route('/manual-trigger-job', methods=['GET'])
def trigger_job():
    try:
        schedule_meal_plans()
        return jsonify({"message": "Job triggered successfully!"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to trigger job: " + str(e)}), 500

# Endpoint to generate a weekly meal plan for a new user after their onboarding process is complete.
@meal_plan_blueprint.route('/new-user-weekly-meal/', methods=['GET'])
def handle_create_new_user_weekly_plan():
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({"error": "User ID is required"}), 400

    try:
        output_string = setting_meal_plan_new_user(user_id=user_id)
        return output_string
    except Exception as e:
        return jsonify({"error": "Failed to create meal plan for new user: " + str(e)}), 500
