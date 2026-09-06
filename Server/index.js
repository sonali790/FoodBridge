const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const restaurantAuthRoutes = require('./routes/restaurantAuth');
const notificationRoutes = require('./routes/notificationRoutes');
const ngoAuthRoutes = require('./routes/ngoAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const listingRoutes = require('./routes/listingRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FoodBridge API is running');
});

app.use('/api/restaurant', restaurantAuthRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ngo', ngoAuthRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/ratings', ratingRoutes);

mongoose.connect('mongodb://localhost:27017/foodbridge')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
const Listing = require('./models/Listing');
const Notification = require('./models/Notification');

setInterval(async () => {
  try {
    const expired = await Listing.find({ status: 'Notified', expiresAt: { $lt: new Date() } });
    for (const listing of expired) {
      listing.status = 'Expired';
      listing.expiredAt = new Date();
      await listing.save();
      await Notification.create({
        recipientType: 'restaurant',
        recipientId: listing.restaurant,
        message: `Your ${listing.foodType} listing expired unclaimed.`,
        listing: listing._id
      });
    }
  } catch (err) {
    console.error('Expiry check failed:', err.message);
  }
}, 60 * 1000); // checks every 1 minute
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));