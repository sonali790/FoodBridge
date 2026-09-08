const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// LOGIN ONLY — no public register route for admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
const Restaurant = require('../models/Restaurant');
const NGO = require('../models/NGO');
const Listing = require('../models/Listing');
const verifyToken = require('../middleware/auth');

// STATS (admin only)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only' });
    }
    const [restaurantCount, ngoCount, activeListings] = await Promise.all([
      Restaurant.countDocuments(),
      NGO.countDocuments(),
      Listing.countDocuments({ status: { $ne: 'Expired' } })
    ]);
    res.json({ restaurantCount, ngoCount, activeListings });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;