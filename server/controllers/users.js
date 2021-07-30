const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

module.exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userName, email, password, type } = req.body;

  try {
    // See if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // make new user
    user = new User({
      userName,
      email,
      password,
      type,
    });
    
    // Encrypt password
    user.password = await bcrypt.hash(password, 10);

    // save user to database
    await user.save();

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
        res.json({ token });
      },
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({error : error.message});
  }
};

module.exports.getCheifs = async (req, res) => {
  try {
    let users = await User.find({ type: 'cheif' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

module.exports.editUser = async (req, res) => {};