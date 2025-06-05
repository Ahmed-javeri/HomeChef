// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // To use .env file

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To accept JSON data

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const dishRoutes = require('./routes/dishRoutes');
app.use('/api/dishes', dishRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', require('./routes/feedbackRoutes'));




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
});

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to HomeChef Backend API 🎉');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
