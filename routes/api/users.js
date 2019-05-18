const express = require('express');

const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

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
    check('email', 'Invalid E-mail').isEmail(),
    check('password', 'Password must contain atleast (6) characters').isLength({
      min: 6,
    }),
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

      // Now Lastly Return {jsonwebtoken} to User
      // ========================================

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtToken'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
