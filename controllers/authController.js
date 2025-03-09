const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, role });

    await user.save();

    // Redirect to login page after successful registration
    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true });

      // Redirect based on role
      if (user.role === 'client') {
        res.redirect('/appointments');
      } else if (user.role === 'professional') {
        res.redirect('/professional');
      } else if (user.role === 'admin') {
        res.redirect('/admin');
      }
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
};