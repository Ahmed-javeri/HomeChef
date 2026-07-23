const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// ✅ Register a new user (FIXED)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });

    await newUser.save();

    // 🔥 ADDED: token generate (IMPORTANT FIX)
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      'jwtsecretkey',
      { expiresIn: '1h' }
    );

    // 🔥 ADDED: proper response (frontend expects this)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address || '',
        phone: newUser.phone || ''
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'jwtsecretkey', {
      expiresIn: '1h'
    });

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address || '',
        phone: user.phone || ''
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Get Customer Profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Update Customer Profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { address, phone } = req.body;

    if (!/^\+92\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number format. Use +92XXXXXXXXXX' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { address: address, phone: phone } },
      { new: true, upsert: false }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    res.status(200).json({ message: 'User found. You can reset your password now.' });
  } catch (error) {
    console.error('Forgot Password error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// ✅ Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;