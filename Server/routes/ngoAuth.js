const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const NGO = require('../models/NGO');
const sendEmail = require('../utils/sendEmail');
const { generateOtp } = require('../utils/otp');
const { isStrongPassword } = require('../utils/passwordValidator');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, foodTypeNeeded, peopleServed } = req.body;

    const existing = await NGO.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

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
    const { email, password } = req.body;

    const ngo = await NGO.findOne({ email });
    if (!ngo) return res.status(400).json({ message: 'Invalid email or password' });

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
    const { email } = req.body;
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
    const { email, otp, newPassword } = req.body;

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