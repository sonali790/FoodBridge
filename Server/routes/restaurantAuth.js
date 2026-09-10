const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const NGO = require('../models/NGO');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');
const { generateOtp } = require('../utils/otp');
const { isStrongPassword } = require('../utils/passwordValidator');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, location, cuisineType } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.trim().toLowerCase();

    const existingRest = await Restaurant.findOne({ email });
    if (existingRest) return res.status(400).json({ message: 'Email already registered as a restaurant' });

    const existingNgo = await NGO.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ message: 'This email is already registered as an NGO. Please log in from the NGO Portal or use a different email.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'This email is reserved for administration.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const restaurant = new Restaurant({
      name, email, password: hashedPassword, location, cuisineType
    });
    await restaurant.save();

    sendEmail(email, 'Welcome to FoodBridge', `Hi ${name}, you've successfully registered as a restaurant on FoodBridge!`);

    res.status(201).json({ message: 'Restaurant registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    email = email.trim().toLowerCase();

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      const ngo = await NGO.findOne({ email });
      if (ngo) {
        return res.status(400).json({ message: 'This email is registered as an NGO. Please sign in via the NGO Login.' });
      }
      const admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ message: 'This email is an Admin account. Please sign in via the Admin Login.' });
      }
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: restaurant._id, role: 'restaurant' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    sendEmail(email, 'FoodBridge Login Alert', `Hi ${restaurant.name}, you just logged in to FoodBridge.`);

    res.json({ message: 'Login successful', token, restaurant: { id: restaurant._id, name: restaurant.name, email: restaurant.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// FORGOT PASSWORD - request an OTP
router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    if (email) email = email.trim().toLowerCase();
    const restaurant = await Restaurant.findOne({ email });

    // Always respond the same way whether or not the email exists, to avoid leaking registered emails
    if (!restaurant) {
      return res.json({ message: 'If that email is registered, a reset code has been sent.' });
    }

    const otp = generateOtp();
    restaurant.resetPasswordOTP = await bcrypt.hash(otp, 10);
    restaurant.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await restaurant.save();

    sendEmail(email, 'FoodBridge Password Reset Code', `Hi ${restaurant.name}, your FoodBridge password reset code is ${otp}. It expires in 10 minutes.`);

    res.json({ message: 'If that email is registered, a reset code has been sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// RESET PASSWORD - verify OTP and set new password
router.post('/reset-password', async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    if (email) email = email.trim().toLowerCase();

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password does not meet strength requirements' });
    }

    const restaurant = await Restaurant.findOne({ email }).select('+resetPasswordOTP +resetPasswordExpires');
    if (!restaurant || !restaurant.resetPasswordOTP || !restaurant.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (restaurant.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    const otpMatches = await bcrypt.compare(otp, restaurant.resetPasswordOTP);
    if (!otpMatches) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    restaurant.password = await bcrypt.hash(newPassword, 10);
    restaurant.resetPasswordOTP = undefined;
    restaurant.resetPasswordExpires = undefined;
    await restaurant.save();

    sendEmail(email, 'FoodBridge Password Changed', `Hi ${restaurant.name}, your FoodBridge password was just reset. If this wasn't you, please contact support.`);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;