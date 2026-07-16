//GENERATE RECIPES 

require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

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
async function fetchFoodImage() {
  try {
    const res = await fetch('https://foodish-api.com/api/');
    const data = await res.json();
    return data.image;
  } catch (err) {
    // Fallback if the API hiccups mid-seed, so one failed request doesn't crash the whole run
    return 'https://foodish-api.com/images/pizza/pizza1.jpg';
  }
}
async function generateRecipe(authorIds) {
  const adjective = pickRandom(ADJECTIVES);
  const main = pickRandom(MAINS);
  const dishType = pickRandom(DISH_TYPES);
  const title = `${adjective} ${main} ${dishType}`;

  const category = pickRandom(CATEGORIES);
  const prepTime = Math.floor(Math.random() * 86) + 5; // 5–90 minutes

  const ingredientCount = Math.floor(Math.random() * 5) + 4; // 4–8 ingredients
  const ingredients = [
    `${main.toLowerCase()}`,
    ...pickMultiple(INGREDIENT_POOL, ingredientCount),
  ];

  const stepCount = Math.floor(Math.random() * 3) + 4; // 4–6 steps
  const steps = pickMultiple(STEP_TEMPLATES, stepCount).map((fn) => fn(main));

  const author = pickRandom(authorIds);

  return {
    title,
    ingredients,
    steps,
    prepTime,
    category,
    imageUrl: await fetchFoodImage(),
    author: author._id,
    authorName: author.name,
    createdAt: new Date(),
  };
}

async function ensureSeedAuthors(db) {
  const existingUsers = await db.collection('users').find({}).limit(10).toArray();
  if (existingUsers.length > 0) {
    console.log(`Using ${existingUsers.length} existing user(s) as recipe authors.`);
    return existingUsers;
  }

  console.log('No existing users found — creating 2 seed authors.');
  const passwordHash = await bcrypt.hash('seed-password-123', 10);
  const seedUsers = [
    { name: 'Marcus Reed', email: 'marcus.seed@forkshare.dev', passwordHash, createdAt: new Date() },
    { name: 'Priya Patel', email: 'priya.seed@forkshare.dev', passwordHash, createdAt: new Date() },
  ];
  const result = await db.collection('users').insertMany(seedUsers);
  return seedUsers.map((u, i) => ({ ...u, _id: Object.values(result.insertedIds)[i] }));
}

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db('forkshare');
    console.log('Connected to MongoDB (forkshare database)');

    const authors = await ensureSeedAuthors(db);
    const TOTAL_RECIPES = 1200; // comfortably over the 1k requirement
    const recipes = [];
    for (let i = 0; i < TOTAL_RECIPES; i++) {
      recipes.push(await generateRecipe(authors));
      if (i % 100 === 0) console.log(`Generated ${i}/${TOTAL_RECIPES}...`);
    }
    
    console.log(`Inserting ${recipes.length} synthetic recipes...`);
    const result = await db.collection('recipes').insertMany(recipes);
    console.log(`Done. Inserted ${result.insertedCount} recipes.`);

    const totalCount = await db.collection('recipes').countDocuments();
    console.log(`Total recipes in collection now: ${totalCount}`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
