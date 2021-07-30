const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

module.exports.tokenUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });

    // check if it's not a user
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid email or password' }] });
    }

    // we found the user with the same email so we want to check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid email or password' }] });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    /// change the expiresIn to 360 (one hour) before deployement
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, type: user.type });
      },
    );
  } catch (error) {
    res.status(500).json({error : error.message});
  }
};
