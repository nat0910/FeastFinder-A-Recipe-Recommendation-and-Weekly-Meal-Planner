import React, { useState } from "react";
import Images from "../../assets/images/Image";

import SearchBarWithFilters from "../../components/home/SearchComponent";
import CategoryCard from "../../components/home/CategoryCard";
import RecipeCard from "../../components/home/RecipeCard";

import WeeklyMealPlan from "../../components/home/WeeklyCard";
import { useRecipe } from "../../utils/context/RecipeContext";

const weekly_plan =
  '{"Monday": {"breakfast": {"recipe_name": "Mushroom and Pate Omelette Aust Ww 3.5 Pts", "recipe_id": 99633, "ingredients": "[\'mushrooms\', \'shallot\', \'eggs\', \'water\']", "total_time": 10.0, "cook_time": 5.0, "prep_time": 5.0, "keywords": "[\'< 15 Mins\', \'Easy\']", "calories": 192.2}, "lunch/snack": {"recipe_name": "Baleadas- Cheap, Easy Honduran Meal", "recipe_id": 122612, "ingredients": "[\'flour tortillas\', \'butter\', \'margarine\']", "total_time": 10.0, "cook_time": 5.0, "prep_time": 5.0, "keywords": "[\'Beans\', \'Kid Friendly\', \'< 15 Mins\', \'Beginner Cook\', \'Easy\', \'Inexpensive\']", "calories": 582.5}, "dinner": {"recipe_name": "Ataulfo Mango Jam", "recipe_id": 119863, "ingredients": "[\'mangoes\', \'white wine\', \'water\', \'vanilla pod\', \'granulated sugar\']", "total_time": 50.0, "cook_time": 45.0, "prep_time": 5.0, "keywords": "[\'Tropical Fruits\', \'Fruit\', \'Asian\', \'Mexican\', \'Vegan\', \'Spring\', \'Summer\', \'Sweet\', \'Brunch\', \'< 60 Mins\', \'Stove Top\', \'Easy\']"}}, "Tuesday": {"breakfast": {"recipe_name": "Apple Puffed Pancake", "recipe_id": 96271, "ingredients": "[\'eggs\', \'skim milk\', \'pure vanilla extract\', \'flour\', \'granulated sugar\', \'salt\', \'ground cinnamon\', \'nutmeg\', \'unsalted butter\', \'apples\', \'light brown sugar\', \\"confectioners\' sugar\\"]", "total_time": 30.0, "cook_time": 20.0, "prep_time": 10.0, "keywords": "[\'Apple\', \'Fruit\', \'Scandinavian\', \'European\', \'Kid Friendly\', \'Brunch\', \'< 30 Mins\']", "calories": 385.6}, "lunch/snack": {"recipe_name": "Quick Very Simple Roasted Tomatoes", "recipe_id": 58564, "ingredients": "[\'olive oil flavored cooking spray\', \'cherry tomatoes\', \'garlic powder\', \'fresh basil\']", "total_time": 11.0, "cook_time": 10.0, "prep_time": 1.0, "keywords": "[\'Vegetable\', \'Low Protein\', \'Low Cholesterol\', \'Healthy\', \'Roast\', \'< 15 Mins\', \'Oven\', \'Easy\']", "calories": 47.2}, "dinner": {"recipe_name": "Easy Cheesy Alfredo Sauce", "recipe_id": 116591, "ingredients": "[\'butter\', \'low-fat cream cheese\', \'garlic clove\', \'1% low-fat milk\', \'fresh parmesan cheese\', \'ground black pepper\', \'nutmeg\']", "total_time": 10.0, "cook_time": 5.0, "prep_time": 5.0, "keywords": "[\'Cheese\', \'High In...\', \'< 15 Mins\', \'Easy\']"}}, "Wednesday": {"breakfast": {"recipe_name": "Paleo Breakfast Veggie Hash With Eggs", "recipe_id": 160670, "ingredients": "[\'extra virgin olive oil\', \'butter\', \'garlic cloves\', \'sweet white onion\', \'mushroom\', \'cherry tomatoes\', \'fresh spinach\', \'eggs\']", "total_time": 30.0, "cook_time": 15.0, "prep_time": 15.0, "keywords": "[\'Spinach\', \'Greens\', \'Vegetable\', \'Free Of...\', \'Brunch\', \'< 30 Mins\', \'Easy\']", "calories": 348.2}, "lunch/snack": {"recipe_name": "Pumpkin and Spinach Pizza", "recipe_id": 134745, "ingredients": "[\'basil pesto\', \'cheddar cheese\', \'spinach\', \'dried tomatoes\', \'pumpkin\']", "total_time": 35.0, "cook_time": 20.0, "prep_time": 15.0, "keywords": "[\'Vegetable\', \'< 60 Mins\', \'Easy\', \'Inexpensive\']", "calories": 269.2}, "dinner": {"recipe_name": "Cranberry Whole Wheat Scones, Diabetic Friendly", "recipe_id": 87208, "ingredients": "[\'all-purpose flour\', \'whole wheat flour\', \'Splenda sugar substitute\', \'baking powder\', \'ground ginger\', \'cinnamon\', \'baking soda\', \'salt\', \'butter\', \'Egg Beaters egg substitute\', \'buttermilk\', \'dried cranberries\', \'dried currant\', \'buttermilk\', \'rolled oats\']", "total_time": 30.0, "cook_time": 15.0, "prep_time": 15.0, "keywords": "[\'Quick Breads\', \'Breads\', \'Fruit\', \'Brunch\', \'< 30 Mins\', \'Easy\']"}}, "Thursday": {"breakfast": {"recipe_name": "Breakfast Sausage Grilled Cheese", "recipe_id": 173520, "ingredients": "[\'butter\', \'American cheese\', \'apples\']", "total_time": 12.0, "cook_time": 7.0, "prep_time": 5.0, "keywords": "[\'Pork\', \'Meat\', \'< 15 Mins\', \'Easy\']", "calories": 328.8}, "lunch/snack": {"recipe_name": "Chili Chips", "recipe_id": 99047, "ingredients": "[\'potatoes\', \'olive oil\', \'salt\', \'chili powder\']", "total_time": 60.0, "cook_time": 55.0, "prep_time": 5.0, "keywords": "[\'Potato\', \'Vegetable\', \'Low Protein\', \'Low Cholesterol\', \'Healthy\', \'< 60 Mins\', \'Beginner Cook\', \'Easy\', \'Inexpensive\']", "calories": 405.5}, "dinner": {"recipe_name": "Italian Peas and Eggs", "recipe_id": 114485, "ingredients": "[\'onion\', \'olive oil\', \'peas\', \'crushed red pepper flakes\', \'eggs\', \'salt\', \'pepper\']", "total_time": 10.0, "cook_time": 5.0, "prep_time": 5.0, "keywords": "[\'< 15 Mins\', \'Beginner Cook\', \'Easy\', \'Inexpensive\']"}}, "Friday": {"breakfast": {"recipe_name": "Banana Buttermilk Pancakes", "recipe_id": 30897, "ingredients": "[\'all-purpose flour\', \'granulated sugar\', \'baking soda\', \'walnuts\', \'banana\', \'buttermilk\', \'eggs\', \'butter\', \'butter\']", "total_time": 40.0, "cook_time": 30.0, "prep_time": 10.0, "keywords": "[\'Tropical Fruits\', \'Fruit\', \'Canadian\', \'Kid Friendly\', \'Brunch\', \'< 60 Mins\', \'Stove Top\', \'Inexpensive\']", "calories": 478.6}, "lunch/snack": {"recipe_name": "Jill Samwiches", "recipe_id": 145828, "ingredients": "[\'swiss cheese\', \'cream cheese\', \'butter\', \'mayonnaise\']", "total_time": 10.0, "cook_time": 5.0, "prep_time": 5.0, "keywords": "[\'Cheese\', \'Kid Friendly\', \'High In...\', \'Weeknight\', \'Brunch\', \'< 15 Mins\', \'Easy\', \'Inexpensive\']", "calories": 514.2}, "dinner": {"recipe_name": "Basic Steamed Kale", "recipe_id": 128090, "ingredients": "[\'fresh kale\', \'garlic clove\', \'salt\', \'cracked black pepper\']", "total_time": 15.0, "cook_time": 10.0, "prep_time": 5.0, "keywords": "[\'Vegan\', \'Winter\', \'< 15 Mins\', \'Beginner Cook\', \'Easy\']"}}, "Saturday": {"breakfast": {"recipe_name": "Ww Breakfast Burrito", "recipe_id": 122671, "ingredients": "[\'tortilla\', \'fat free egg substitute\', \'fat-free American cheese\']", "total_time": 15.0, "cook_time": 5.0, "prep_time": 10.0, "keywords": "[\'Tex Mex\', \'Southwestern U.S.\', \'Microwave\', \'< 15 Mins\', \'Beginner Cook\', \'Stove Top\', \'Easy\', \'Inexpensive\']", "calories": 300.1}, "lunch/snack": {"recipe_name": "Healthy Peanut Butter", "recipe_id": 77740, "ingredients": "[\'unsalted peanuts\', \'salt\', \'demerara sugar\']", "total_time": 15.0, "cook_time": 0.0, "prep_time": 15.0, "keywords": "[\'Vegan\', \'Kid Friendly\', \'Kosher\', \'Mixer\', \'< 15 Mins\', \'For Large Groups\', \'Small Appliance\', \'Easy\', \'Inexpensive\']", "calories": 209.8}, "dinner": {"recipe_name": "Rocky Road Bars", "recipe_id": 147474, "ingredients": "[\'unsalted butter\', \'granulated sugar\', \'eggs\', \'vanilla extract\', \'kosher salt\', \'all-purpose flour\', \'baking powder\', \'mini marshmallows\']", "total_time": 80.0, "cook_time": 60.0, "prep_time": 20.0, "keywords": "[\'Dessert\', \'Cookie & Brownie\', \'Sweet\', \'Weeknight\', \'For Large Groups\', \'< 4 Hours\']"}}, "Sunday": {"breakfast": {"recipe_name": "Whole Wheat Banana Pancakes", "recipe_id": 121156, "ingredients": "[\'whole wheat flour\', \'brown sugar\', \'baking powder\', \'salt\', \'skim milk\', \'egg\', \'canola oil\']", "total_time": 15.0, "cook_time": 10.0, "prep_time": 5.0, "keywords": "[\'Healthy\', \'< 15 Mins\', \'Easy\']", "calories": 216.7}, "lunch/snack": {"recipe_name": "Love at First Bite", "recipe_id": 100949, "ingredients": "[\'apple\', \'peanut butter\', \'raisins\', \'cinnamon\']", "total_time": 2.0, "cook_time": 0.0, "prep_time": 2.0, "keywords": "[\'Apple\', \'Fruit\', \'Low Protein\', \'Low Cholesterol\', \'Kid Friendly\', \'< 15 Mins\', \'Beginner Cook\', \'Easy\']", "calories": 197.4}, "dinner": {"recipe_name": "Teriyaki Sauce", "recipe_id": 123550, "ingredients": "[\'fresh garlic\', \'brown sugar\', \'soy sauce\']", "total_time": 10.0, "cook_time": 0.0, "prep_time": 10.0, "keywords": "[\'Healthy\', \'< 15 Mins\', \'Easy\']"}}}';

const categories = [
  { name: "Breakfast", icon: Images.breakfast },
  { name: "Lunch", icon: Images.lunch },
  { name: "Dessert", icon: Images.dessert },
  { name: "Curries", icon: Images.curry },
  { name: "Beverages", icon: Images.beverages },
  { name: "Vegetable", icon: Images.vegetable },
  { name: "Chicken", icon: Images.chicken },
  { name: "Cheese", icon: Images.cheese },
  { name: "Indian", icon: Images.indian },
  { name: "Japanese", icon: Images.japanese },
  { name: "Chinese", icon: Images.chinese },
  { name: "European", icon: Images.european },
];

export default function HomePage() {
  const { tailoredList, Curated, weeklyData } = useRecipe();

  return (
    <>
      <SearchBarWithFilters />

      <WeeklyMealPlan
        data={weeklyData?.weekly_plan ? weeklyData?.weekly_plan : weekly_plan}
      />

      {/* Categories List*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <h2 className="text-base sm:text-2xl font-semibold">Categories</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>

      {/* Recommend List*/}
      <div className="container mt-1 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <h2 className="text-base sm:text-2xl font-semibold">
            Tailored for You
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
          {tailoredList.map((category, index) => (
            <RecipeCard key={index} recipe={category} />
          ))}
        </div>
      </div>

      {/* Recommend List*/}
      <div className="container mt-1 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <h2 className="text-base sm:text-2xl font-semibold">
            Curated Cuisine Favorites
          </h2>
        </div>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide">
          {Curated.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
}
