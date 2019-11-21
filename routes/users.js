const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();
const User = require('../models/User');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    bcrypt
      .genSalt(10)
      .then(salt => {
        return bcrypt.hash(req.body.password, salt);
      })
      .then(hash => {
        newUser.password = hash;
        return newUser.save();
      })
      .then(() => {
        req.flash('success_msg', 'User Registered');
        res.redirect('/users/login');
      })
      .catch(err => {
        req.flash('error_msg', err.message);
        res.redirect('/users/register');
      });
  }
});

// Log out user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
