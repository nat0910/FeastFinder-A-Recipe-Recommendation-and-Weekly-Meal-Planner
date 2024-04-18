from flask import Blueprint,request
from app.controller.user_controller import  check_user_email,reset_user_password,create_new_user,get_login,get_refresh_token,store_onboarding_details,edit_nutritional_data,get_user,get_user_preferences,get_compute_cluster


user_blueprint = Blueprint('user',__name__)

# Create New User Endpoint
@user_blueprint.route('/register',methods=['POST'])
def handle_user_resgistration():
    return create_new_user(request)


#Login Endpoint
@user_blueprint.route('/signin',methods=['POST'])
def handle_user_signin():
    return get_login(request)
    
@user_blueprint.route('/check-email',methods=['POST'])
def handle_check_email_exist():
    return check_user_email(request)

@user_blueprint.route('/reset-password',methods=['POST'])
def handle_reset_password():
    return reset_user_password(request)


@user_blueprint.route('/refresh_token',methods=['POST'])
def handle_refresh_token():
    return get_refresh_token()


@user_blueprint.route('/onboarding',methods=['POST'])
def handle_onboarding_complete():
    return store_onboarding_details(request)

# Endpoint to update nutritional values
@user_blueprint.route('/nutrition', methods=['PUT'])
def update_nutritional_values():
    return edit_nutritional_data(request)

# Define the route for fetching user information
@user_blueprint.route('/user-profile/<int:user_id>', methods=['GET'])
def handle_user_profile(user_id):
    return get_user(user_id)


@user_blueprint.route('/preferences/<int:user_id>', methods=['GET'])
def handle_user_perference(user_id):
    return get_user_preferences(user_id)

@user_blueprint.route('/compute_cluster', methods=['POST'])
def compute_cluster_endpoint():
    return get_compute_cluster(request)