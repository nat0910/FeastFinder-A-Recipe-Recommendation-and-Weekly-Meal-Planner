from flask import Blueprint,jsonify,request
from app.controller.archive_meal_plan_controller import archive_meal_plans, get_archived_meal_plans

archive_meal_plan_blueprint = Blueprint('archive_meal_plan',__name__)

# Get the users weekly meal plan
@archive_meal_plan_blueprint.route('/weekly-meal/<int:user_id>')
def handle_get_weekly_meal(user_id:int):
    return jsonify(get_archived_meal_plans(user_id))

# Manually trigger the cron job
@archive_meal_plan_blueprint.route('/manual-trigger-job',methods=['GET'])
def trigger_job():
    unit = request.args.get('unit', default='days')
    value = int(request.args.get('value', default=30))

    if unit not in ['days', 'minutes']:
        return 'Invalid unit. Please use either "days" or "minutes".', 400

    archive_meal_plans(unit=unit,value=value)  
    return 'Job triggered successfully!',200


