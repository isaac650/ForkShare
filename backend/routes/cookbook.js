const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const ensureAuth = require("../middleware/ensureAuth");

const router = express.Router();

function mergeCookbookEntry(entry, recipe) {
  return {
    _id: entry._id,
    recipeId: entry.recipeId,
    notes: entry.notes,
    addedAt: entry.addedAt,
    title: recipe?.title || "Recipe not found",
    category: recipe?.category || "",
    imageUrl: recipe?.imageUrl || "",
  };
}

// GET /api/cookbook for current user
router.get("/", ensureAuth, async (req, res) => {
  try {
    const db = getDB();

    const entries = await db
      .collection("cookbookEntries")
      .find({ userId: req.user._id })
      .toArray();

    if (entries.length === 0) {
      return res.json([]);
    }

    const recipeIds = entries.map((entry) => entry.recipeId);
    const recipes = await db
      .collection("recipes")
      .find({ _id: { $in: recipeIds } })
      .toArray();

    const recipeMap = new Map(
      recipes.map((recipe) => [recipe._id.toString(), recipe]),
    );

    const merged = entries.map((entry) =>
      mergeCookbookEntry(entry, recipeMap.get(entry.recipeId.toString())),
    );

    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cookbook adds a recipe to the current user's cookbook
router.post("/", ensureAuth, async (req, res) => {
  try {
    const db = getDB();
    const { recipeId, notes } = req.body;

    if (!recipeId) {
      return res.status(400).json({ error: "recipeId is required" });
    }

    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(recipeId) });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const entry = {
      recipeId: new ObjectId(recipeId),
      userId: req.user._id,
      notes: notes || "",
      addedAt: new Date(),
    };

    const result = await db.collection("cookbookEntries").insertOne(entry);

    res
      .status(201)
      .json(mergeCookbookEntry({ _id: result.insertedId, ...entry }, recipe));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cookbook/:id updates notes for current user's cookbook
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    const db = getDB();
    const { notes } = req.body;

    const result = await db
      .collection("cookbookEntries")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id), userId: req.user._id },
        { $set: { notes: notes || "" } },
        { returnDocument: "after" },
      );

    if (!result) {
      return res.status(404).json({ error: "Entry not found" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cookbook/:id removes a recipe from the current user's cookbook
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    const db = getDB();
    await db.collection("cookbookEntries").deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user._id,
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;