
const fs = require('fs');


const AUTHOR_ID = '6a57d583dd107ea69b5e99a8'; 
const AUTHOR_NAME = 'Demo-Celine';


const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'dessert'];

const ADJECTIVES = [
  'Quick', 'Creamy', 'Spicy', 'Zesty', 'Hearty', 'Rustic', 'Smoky',
  'Crispy', 'Cozy', 'Simple', 'Classic', 'Fresh', 'Savory', 'Sweet',
  'Garlicky', 'Herby', 'One-Pot', 'Sheet-Pan', 'Slow-Cooker', 'Baked',
];

const MAINS = [
  'Chicken', 'Salmon', 'Lentil', 'Chickpea', 'Beef', 'Tofu', 'Shrimp',
  'Mushroom', 'Sweet Potato', 'Black Bean', 'Turkey', 'Pork', 'Quinoa',
  'Zucchini', 'Cauliflower', 'Spinach', 'Butternut Squash', 'Pumpkin',
  'Egg', 'Avocado', 'Rice', 'Pasta', 'Potato', 'Broccoli',
];

const DISH_TYPES = [
  'Stir Fry', 'Soup', 'Salad', 'Tacos', 'Curry', 'Casserole', 'Bowl',
  'Skillet', 'Wrap', 'Pancakes', 'Muffins', 'Bake', 'Chili', 'Stew',
  'Pasta', 'Pizza', 'Sandwich', 'Frittata', 'Hash', 'Risotto',
];

const INGREDIENT_POOL = [
  'olive oil', 'garlic', 'onion', 'salt', 'black pepper', 'lemon juice',
  'soy sauce', 'ginger', 'cumin', 'paprika', 'chili flakes', 'butter',
  'flour', 'eggs', 'milk', 'parmesan cheese', 'mozzarella', 'basil',
  'oregano', 'thyme', 'rosemary', 'cilantro', 'parsley', 'tomatoes',
  'bell peppers', 'carrots', 'celery', 'green onions', 'lime juice',
  'honey', 'brown sugar', 'vanilla extract', 'baking powder', 'cinnamon',
  'coconut milk', 'vegetable broth', 'chicken broth', 'white wine',
  'balsamic vinegar', 'dijon mustard', 'red pepper flakes', 'sesame oil',
  'panko breadcrumbs', 'heavy cream', 'sour cream', 'greek yogurt',
];

const STEP_TEMPLATES = [
  (m) => `Heat a pan over medium heat and add a drizzle of oil.`,
  (m) => `Add the ${m.toLowerCase()} and cook until browned, about 5-7 minutes.`,
  (m) => `Season with salt, pepper, and your favorite spices.`,
  (m) => `Add the remaining ingredients and stir to combine.`,
  (m) => `Reduce heat to low and let simmer for 10-15 minutes.`,
  (m) => `Taste and adjust seasoning as needed.`,
  (m) => `Serve hot, garnished with fresh herbs.`,
  (m) => `Let rest for a few minutes before serving.`,
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRecipe() {
  const adjective = pickRandom(ADJECTIVES);
  const main = pickRandom(MAINS);
  const dishType = pickRandom(DISH_TYPES);
  const title = `${adjective} ${main} ${dishType}`;

  const category = pickRandom(CATEGORIES);
  const prepTime = Math.floor(Math.random() * 86) + 5;

  const ingredientCount = Math.floor(Math.random() * 5) + 4;
  const ingredients = [
    main.toLowerCase(),
    ...pickMultiple(INGREDIENT_POOL, ingredientCount),
  ];

  const stepCount = Math.floor(Math.random() * 3) + 4;
  const steps = pickMultiple(STEP_TEMPLATES, stepCount).map((fn) => fn(main));

  return {
    title,
    ingredients,
    steps,
    prepTime,
    category,
    imageUrl: (() => {
      const foodCategory = pickRandom(['pizza', 'burger', 'dessert', 'pasta', 'rice', 'biryani', 'samosa']);
      return `https://foodish-api.com/images/${foodCategory}/${foodCategory}${Math.floor(Math.random() * 10) + 1}.jpg`;
    })(),
    author: { $oid: AUTHOR_ID }, // Extended JSON format so Atlas import recognizes it as an ObjectId
    authorName: AUTHOR_NAME,
    createdAt: { $date: new Date().toISOString() },
  };
}

const TOTAL_RECIPES = 1200;
const recipes = [];
for (let i = 0; i < TOTAL_RECIPES; i++) {
  recipes.push(generateRecipe());
}

fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
console.log(`Wrote ${recipes.length} recipes to recipes.json`);
console.log('Next: go to Atlas Data Explorer -> forkshare database -> recipes collection -> Insert Document (or "Import Data") and upload this file.');
