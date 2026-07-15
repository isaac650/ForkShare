const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const ensureAuth = require('../middleware/ensureAuth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, maxTime } = req.query;
    const db = getDB();
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (maxTime) {
      query.prepTime = { $lte: Number(maxTime) };
    }

    const recipes = await db.collection('recipes').find(query).sort({ createdAt: -1 }).toArray();
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(req.params.id) });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid recipe id' });
  }
});

router.post('/', ensureAuth, async (req, res) => {
  try {
    const { title, ingredients, steps, prepTime, category, imageUrl } = req.body;

    if (!title || !ingredients || !steps || !prepTime || !category) {
      return res.status(400).json({ error: 'title, ingredients, steps, prepTime, and category are required' });
    }

    const db = getDB();
    const newRecipe = {
      title,
      ingredients,
      steps,
      prepTime: Number(prepTime),
      category,
      imageUrl: imageUrl || null,
      author: req.user._id,
      authorName: req.user.name,
      createdAt: new Date(),
    };

    const result = await db.collection('recipes').insertOne(newRecipe);
    res.status(201).json({ _id: result.insertedId, ...newRecipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

router.put('/:id', ensureAuth, async (req, res) => {
  try {
    const db = getDB();
    const recipeId = new ObjectId(req.params.id);
    const recipe = await db.collection('recipes').findOne({ _id: recipeId });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own recipes' });
    }

    const { title, ingredients, steps, prepTime, category, imageUrl } = req.body;
    const updates = {
      ...(title && { title }),
      ...(ingredients && { ingredients }),
      ...(steps && { steps }),
      ...(prepTime && { prepTime: Number(prepTime) }),
      ...(category && { category }),
      ...(imageUrl !== undefined && { imageUrl }),
      updatedAt: new Date(),
    };

    await db.collection('recipes').updateOne({ _id: recipeId }, { $set: updates });
    const updated = await db.collection('recipes').findOne({ _id: recipeId });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const db = getDB();
    const recipeId = new ObjectId(req.params.id);
    const recipe = await db.collection('recipes').findOne({ _id: recipeId });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own recipes' });
    }

    await db.collection('recipes').deleteOne({ _id: recipeId });
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

module.exports = router;
