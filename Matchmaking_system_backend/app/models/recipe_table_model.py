from app.extension import db
import json

class Recipe(db.Model):
    __tablename__ = "recipes"
    recipe_id = db.Column(db.Integer, primary_key=True)
    recipe_name = db.Column(db.String(255), nullable=False ,index=True)
    recipe_category = db.Column(db.String(100), nullable=True)

    recipe_description = db.Column(db.Text, nullable=True)
    recipe_images = db.Column(db.Text, nullable=True) 

    calories = db.Column(db.Float, nullable=False)
    fat_content = db.Column(db.Float, nullable=False)
    saturated_fat_content = db.Column(db.Float, nullable=False)
    cholesterol_content = db.Column(db.Float, nullable=False)
    sodium_content = db.Column(db.Float, nullable=False)
    carbohydrate_content = db.Column(db.Float, nullable=False)
    fiber_content = db.Column(db.Float, nullable=False)
    sugar_content = db.Column(db.Float, nullable=False)
    protein_content = db.Column(db.Float, nullable=False)

    cook_time = db.Column(db.Float, nullable=False)
    prep_time = db.Column(db.Float, nullable=False)
    total_time = db.Column(db.Float, nullable=False)

    keywords = db.Column(db.Text, nullable=False)  
    recipe_ingredients = db.Column(db.Text, nullable=False)  
    recipe_instructions = db.Column(db.Text, nullable=False)  
   
    allergy_type = db.Column(db.Text, nullable=False)
    diet_type = db.Column(db.String(50), nullable=False,index=True)
    cuisine = db.Column(db.Text, nullable=False)  

    nutritional_cluster = db.Column(db.Integer, nullable=False,index=True)

    @staticmethod
    def fields_to_load():
        return [
            Recipe.recipe_id, Recipe.recipe_name, Recipe.recipe_category,Recipe.recipe_description,Recipe.recipe_images,
            Recipe.calories, Recipe.fat_content, Recipe.saturated_fat_content,
            Recipe.cholesterol_content, Recipe.sodium_content, Recipe.carbohydrate_content, 
            Recipe.fiber_content, Recipe.sugar_content, Recipe.protein_content, Recipe.prep_time , Recipe.cook_time, Recipe.total_time, 
            Recipe.recipe_ingredients, Recipe.recipe_instructions, Recipe.diet_type
        ]

    def to_dict(self):
        return {
            'recipe_id': self.recipe_id,
            'recipe_name': self.recipe_name,
            'recipe_category': self.recipe_category,
            'recipe_description': self.recipe_description,
            'recipe_images' : self.recipe_images,
            'calories': self.calories,
            'fat_content': self.fat_content,
            'saturated_fat_content': self.saturated_fat_content,
            'cholesterol_content': self.cholesterol_content,
            'sodium_content': self.sodium_content,
            'carbohydrate_content': self.carbohydrate_content,
            'fiber_content': self.fiber_content,
            'sugar_content': self.sugar_content,
            'protein_content': self.protein_content,
            'cook_time': self.cook_time,
            'prep_time': self.prep_time,
            'total_time': self.total_time,
            'keywords': self.keywords,
            'recipe_ingredients': self.recipe_ingredients,
            'recipe_instructions': self.recipe_instructions,
            'diet_type': self.diet_type,
            'nutritional_cluster': self.nutritional_cluster,
            'allergy_type': self.allergy_type,
            'cuisine':self.cuisine
        }

    @staticmethod
    def from_dict(data):
        return Recipe(
            recipe_name=data['recipe_name'],
            recipe_category=data['recipe_category'],
            calories=data['calories'],
            fat_content=data['fat_content'],
            saturated_fat_content=data['saturated_fat_content'],
            cholesterol_content=data['cholesterol_content'],
            sodium_content=data['sodium_content'],
            carbohydrate_content=data['carbohydrate_content'],
            fiber_content=data['fiber_content'],
            sugar_content=data['sugar_content'],
            protein_content=data['protein_content'],
            cook_time=data['cook_time'],
            prep_time=data['prep_time'],
            total_time=data['total_time'],
            keywords=data['keywords'],
            recipe_ingredients=data['recipe_ingredients'],
            recipe_instructions=data['recipe_instructions'],
            diet_type=data['diet_type'],
            nutritional_cluster=data['nutritional_cluster'],
            allergy_type=data['allergy_type'],
            cuisine=data['cuisine']
        )

    def __repr__(self):
        return f"<Recipe{self.recipe_id} , Name : {self.recipe_name},Category : {self.recipe_category},Ingredients : {self.recipe_ingredients},Instruction : {self.recipe_instructions},Diet: {self.diet_type}>"

