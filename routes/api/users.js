const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const User = require('../../models/User');

// @route     POST api/users
// @desc      Register User
// @access    Public
router.post(
  '/',
  // can add another param to post
  // First:
  // invoking validator / check middleware
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  // using async/await
  async (req, res) => {
    const errors = validationResult(req);
    // error catch
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // this pulls what I want out of req.body
    // const { name, email, password } = req.body;
    console.log(req.body);

    try {
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user));
      // See if user exists

      // Get users gravatar

      // Encrypt password

      // Return jsonwebtoken
      res.send('User Route');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
