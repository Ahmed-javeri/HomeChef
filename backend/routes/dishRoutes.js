const express = require('express');
const Dish = require('../models/dish');
const router = express.Router();

// ✅ GET /api/dishes - Get all dishes (customer side)
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('chefId', '_id name email');
    res.status(200).json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dishes', error });
  }
});

// ✅ POST /api/dishes/add - Add a new dish (Chef only)
router.post('/add', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, chefId } = req.body;

    const newDish = new Dish({
      name,
      description,
      price,
      imageUrl,
      category,
      chefId
    });

    await newDish.save();
    res.status(201).json({ message: 'Dish added successfully', dish: newDish });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add dish', error });
  }
});

module.exports = router;
