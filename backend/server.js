require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const cookbookRoutes = require('./routes/cookbook');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/cookbook', cookbookRoutes);


const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));


app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`ForkShare backend running on http://localhost:${PORT}`);
  });
}

start();