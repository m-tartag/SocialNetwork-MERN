const express = require('express');

const router = express.Router();

// @route     GET api/profile
// @desc      Test Route
// @access    Pubic
router.get('/', (req, res) => {
  res.send('Profile');
});

module.exports = router;
