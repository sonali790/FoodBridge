const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NGO = require('../models/NGO');
const Restaurant = require('../models/Restaurant');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');
const { generateOtp } = require('../utils/otp');
const { isStrongPassword } = require('../utils/passwordValidator');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, location, foodTypeNeeded, peopleServed } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });
    email = email.trim().toLowerCase();

    const existingNgo = await NGO.findOne({ email });
    if (existingNgo) return res.status(400).json({ message: 'Email already registered as an NGO' });

    const existingRest = await Restaurant.findOne({ email });
    if (existingRest) {
      return res.status(400).json({ message: 'This email is already registered as a restaurant. Please log in from the Restaurant Portal or use a different email.' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'This email is reserved for administration.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = new NGO({
      name, email, password: hashedPassword, location, foodTypeNeeded, peopleServed
    });
    await ngo.save();

    sendEmail(email, 'Welcome to FoodBridge', `Hi ${name}, you've successfully registered as an NGO on FoodBridge!`);

    res.status(201).json({ message: 'NGO registered successfully' });
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

    const ngo = await NGO.findOne({ email });
    if (!ngo) {
      const restaurant = await Restaurant.findOne({ email });
      if (restaurant) {
        return res.status(400).json({ message: 'This email is registered as a restaurant. Please sign in via the Restaurant Login.' });
      }
      const admin = await Admin.findOne({ email });
      if (admin) {
        return res.status(400).json({ message: 'This email is an Admin account. Please sign in via the Admin Login.' });
      }
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: ngo._id, role: 'ngo' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    sendEmail(email, 'FoodBridge Login Alert', `Hi ${ngo.name}, you just logged in to FoodBridge.`);

    res.json({ message: 'Login successful', token, ngo: { id: ngo._id, name: ngo.name, email: ngo.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// FORGOT PASSWORD - request an OTP
router.post('/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    if (email) email = email.trim().toLowerCase();
    const ngo = await NGO.findOne({ email });

    // Always respond the same way whether or not the email exists, to avoid leaking registered emails
    if (!ngo) {
      return res.json({ message: 'If that email is registered, a reset code has been sent.' });
    }

    const otp = generateOtp();
    ngo.resetPasswordOTP = await bcrypt.hash(otp, 10);
    ngo.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await ngo.save();

    sendEmail(email, 'FoodBridge Password Reset Code', `Hi ${ngo.name}, your FoodBridge password reset code is ${otp}. It expires in 10 minutes.`);

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

    const ngo = await NGO.findOne({ email }).select('+resetPasswordOTP +resetPasswordExpires');
    if (!ngo || !ngo.resetPasswordOTP || !ngo.resetPasswordExpires) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (ngo.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    const otpMatches = await bcrypt.compare(otp, ngo.resetPasswordOTP);
    if (!otpMatches) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    ngo.password = await bcrypt.hash(newPassword, 10);
    ngo.resetPasswordOTP = undefined;
    ngo.resetPasswordExpires = undefined;
    await ngo.save();

    sendEmail(email, 'FoodBridge Password Changed', `Hi ${ngo.name}, your FoodBridge password was just reset. If this wasn't you, please contact support.`);

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;