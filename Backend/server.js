const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

app.use(cors());
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const dishRoutes = require('./routes/dishRoutes');
app.use('/api/dishes', dishRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/api/feedback', require('./routes/feedbackRoutes'));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
});

app.get('/', (req, res) => {
    res.send('Welcome to HomeChef Backend API 🎉');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
