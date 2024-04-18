from flask import Blueprint,request,jsonify,current_app
from app.controller.recipe_controller import( get_recipe_name_recommendation , get_key_ingred_combine_recommendation,get_recipe_from_id,get_tailored_recipe,get_curated_cusinie,get_recipes_by_category,tailored_recipe_recommendation,get_user_tailored_recipe,get_user_curated_cusinie)
from app.utils.utils import is_ingredient_or_keyword 
from app.models.user_table_model import User

recipes_blueprint = Blueprint('recipes',__name__)

@recipes_blueprint.route("/recommend",methods=['GET'])
def recommend():
    user_input =  request.args.get('query',type=str)
    nutritional_match = request.args.get('nutritional_match',default=False,type=bool)
    cuisines = request.args.get('cuisines',type=str)
    prep_time = request.args.get('prepTime', type=int)
    cook_time = request.args.get('cookTime', type=int)
    total_time = request.args.get('totalcookTime', type=int)
    diet_type =  request.args.get('dietType',type=str)

    current_app.logger.debug(f'Query parameters - prep_time: {prep_time}, cook_time: {cook_time}, total_time: {total_time}, dietType: {diet_type}')


    if not user_input:
        return jsonify({"error": "Query must not be empty"}), 400
    
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({"error": "User ID is required"}), 

    if nutritional_match:
        user = User.query.get(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        user_nutritional_cluster = user.user_nutritional_cluster


    # user_input: str ="",
    # nnn:int = 25,
    # prep_time: int = 0,
    # cook_time: int = 0,
    # total_time: int = 0,
    # cuisines: str = "",
    # diet_type: str = "",
    # user_nutritional_cluster: Optional[int] = None

    if is_ingredient_or_keyword(user_input): 
            if nutritional_match :
                recommendation = get_key_ingred_combine_recommendation(user_input = user_input,nnn=75,prep_time=prep_time,cook_time=cook_time,total_time=total_time,cuisines=cuisines,diet_type=diet_type,user_nutritional_cluster=user_nutritional_cluster)
            else:
                recommendation = get_key_ingred_combine_recommendation(user_input = user_input,nnn=75,prep_time=prep_time,cook_time=cook_time,total_time=total_time,cuisines=cuisines,diet_type=diet_type)
      
    else :
        recommendation = get_recipe_name_recommendation(user_input)

    return jsonify(recommendation)

# Get Data of a specific recipe
@recipes_blueprint.route('/<int:recipe_id>',methods=['GET'])
def handle_recipes_from_id(recipe_id: int):
    return jsonify(get_recipe_from_id(recipe_id))

@recipes_blueprint.route('/tailored-for-you', methods=['GET'])
def handle_tailored_recipe():
    return jsonify(get_user_tailored_recipe(request))

@recipes_blueprint.route('/curated_by_cuisine', methods=['GET'])
def handle_curated_recipe():
    return jsonify(get_user_curated_cusinie(request))

@recipes_blueprint.route('/by-category', methods=['GET'])
def handle_recipes_category():
    return jsonify(get_recipes_by_category(request))


@recipes_blueprint.route('/tailored-recipes', methods=['GET'])
def handle_fallback_tailored_recipe():
    return jsonify(get_tailored_recipe(request))

@recipes_blueprint.route('/curated-recipes', methods=['GET'])
def handle_fallback_curated_recipe():
    return jsonify(get_curated_cusinie(request))