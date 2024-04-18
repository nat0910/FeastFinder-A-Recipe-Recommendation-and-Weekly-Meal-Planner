from annoy import AnnoyIndex

def load_annoy_model(filepath,n_trees = 500):
    ann_index = AnnoyIndex(n_trees,'angular')
    ann_index.load(filepath)
    return ann_index

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer


lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))


common_ingredients = set([
    'chicken', 'beef', 'pork', 'tofu', 'salmon', 'shrimp', 'lamb',
    'rice', 'pasta', 'noodles', 'quinoa', 'barley', 'lentils', 'beans',
    'tomato', 'potato', 'carrot', 'onion', 'garlic', 'lettuce', 'spinach',
    'kale', 'broccoli', 'cauliflower', 'cucumber', 'bell pepper', 'mushroom',
    'apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 'blueberry', 'mango',
    'sugar', 'salt', 'pepper', 'vinegar', 'oil', 'butter', 'flour', 'eggs', 'milk',
    'cheese', 'yogurt', 'cream', 'nuts', 'almonds', 'peanuts', 'walnuts',
    'basil', 'parsley', 'cilantro', 'rosemary', 'thyme', 'oregano', 'cumin',
    'paprika', 'curry', 'turmeric', 'saffron', 'ginger', 'cinnamon', 'vanilla',
    'chili', 'jalapeno', 'habanero', 'serrano', 'black beans', 'kidney beans', 'chickpeas',
    'soy sauce', 'fish sauce', 'coconut milk', 'sesame oil', 'olive oil', 'canola oil',
    'breadcrumbs', 'cornstarch', 'baking powder', 'baking soda', 'yeast',
    'chocolate', 'cocoa powder', 'honey', 'maple syrup', 'agave nectar',
    'wine', 'beer', 'vinegar', 'stock', 'broth'
])

common_keywords = set(['Air Fryer', 'Almond flour', 'American', 'Antioxidant-rich', 'Appetizer',
    'Avocado', 'Baking', 'Beef steak', 'Beverage', 'Blender', 'Breakfast',
    'Broiling', 'Chicken breast', 'Chinese', 'Christmas', 'Coconut oil',
    'Dairy-free', 'Dessert', 'Dinner', 'Easy', '60mins', '30mins','60',"30","4","15",'60 mins', '30 mins',
    'Meat', '4hours', '15mins','4 hours', '15mins', 'Vegetable', 'Healthy', 'Low Cholesterol',
    'Beginner Cook', 'Low Protein', 'Inexpensive', 'Fruit', 'Oven',
    'Kid Friendly', 'European', 'Poultry', 'Weeknight', 'Stove Top',
    'French', 'Frying', 'Gluten-free', 'Grilling', 'Halal', 'High-fiber',
    'High-protein', 'Indian', 'Instant Pot', 'Italian', 'Japanese', 'Kale',
    'Keto', 'Korean', 'Kosher', 'Lentils', 'Low-carb', 'Low-fat', 'Lunch',
    'Mediterranean', 'Mexican', 'Nut-free', 'Paleo', 'Pumpkin', 'Quinoa',
    'Roasting', 'Salad', 'Salmon', 'Sautéing', 'Slow cooking', 'Snack',
    'Soup', 'Steaming', 'Summer', 'Thai', 'Thanksgiving', 'Tofu', 'Vegan',
    'Vegetarian', 'Winter',])




def is_ingredient_or_keyword(user_input:str) ->bool:
    if ',' in user_input or 'and' in user_input:
        return True
    
    user_inputs_words = set(user_input.lower().split())
    matches_ingredients = user_inputs_words.intersection(common_ingredients)
    matches_keywords = user_inputs_words.intersection(common_keywords)

    if matches_ingredients or matches_keywords  : return True

    if len(user_input.split()) > 3: return True

    return False


def preprocess_recipe_name(recipe_name:str)->str:
    lower_recipe = recipe_name.lower()
    lower_recipe_tokens = word_tokenize(lower_recipe)

    filtered_tokens = [word for word in lower_recipe_tokens if word.isalpha() and not word in stop_words]

    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]

    return " ".join(lemmatized_tokens)


