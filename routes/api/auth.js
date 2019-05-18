const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route     GET api/auth
// @desc      Test Route
// @access    Pubic
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Authenticate user and get token
// @access    Public
router.post(
  '/',
  // Express-Validator
  [
    check('email', 'Invalid E-mail').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  // Use Async/Await here - Important
  async (req, res) => {
    const errors = validationResult(req);
    // Fancy Error Catch
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure {req.body}
    const { email, password } = req.body;

    // NEED Try/Catch Using Async/Await
    try {
      // See if user ALREADY exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Now need to MATCH user

      // Payload / Webtoken
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
