const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    category: {
        type: String,
        enum: ['meal', 'snack', 'dessert', 'drink'],
        default: 'meal',
    },
    chefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        default: 0, // New field added for dish rating
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Dish', dishSchema);
