const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const flash = require('connect-flash');
const { createUser, findUserByEmail } = require('../models/userModel');

const router = express.Router();

// GET signup
router.get('/signup', (req, res) => {
  res.render('auth/signup', { message: req.flash('error') });
});

// POST signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    req.flash('error', 'Email already in use');
    return res.redirect('/signup');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(name, email, hashedPassword);
  res.redirect('/login');
});

// GET login
router.get('/login', (req, res) => {
  res.render('auth/login', { message: req.flash('error') });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    req.flash('error', 'Invalid email');
    return res.redirect('/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash('error', 'Wrong password');
    return res.redirect('/login');
  }

  req.session.user = user;
  res.redirect('/notes');
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
