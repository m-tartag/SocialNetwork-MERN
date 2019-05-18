const express = require('express');
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const router = express.Router();
const User = require('../../models/User');

// @route     POST api/users
// @desc      Register User
// @access    Public
router.post(
  '/',

  // Express-Validator
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
  // Use Async/Await here - Important
  async (req, res) => {
    const errors = validationResult(req);
    // Fancy Error Catch
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure {req.body}
    const { name, email, password } = req.body;

    // NEED Try/Catch Using Async/Await
    try {
      // See if user ALREADY exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        console.log('xxxx', user);
      }

      // Gravatar middleware
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // This creates a new instance of the user.. it doesnt SAVE IT YET
      // Must call User.save to save.. must ENCRYPT PASSWORD BEFORE SAVE TO DB..
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // --------------------------
      // Encrypt password Middleware
      //----------------------------
      // Pretty much boilerplate -- Check Documentation
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      // And Finally SAVE USER TO DB
      // ***************************
      await user.save();

      // Return jsonwebtoken

      res.send('User Route');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
