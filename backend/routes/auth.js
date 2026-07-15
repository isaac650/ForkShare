const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { getDB } = require('../config/db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }

    const db = getDB();
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    });

    // Log the new user in , after registering
    const newUser = { _id: result.insertedId, name, email };
    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Registered but failed to log in' });
      return res.status(201).json({ id: newUser._id, name, email });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Login failed' });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ id: user._id, name: user.name, email: user.email });
    });
  })(req, res, next);
});

// POST/logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

// GET /apisession
router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ id: req.user._id, name: req.user.name, email: req.user.email });
  }
  return res.status(401).json({ error: 'Not logged in' });
});

module.exports = router;
