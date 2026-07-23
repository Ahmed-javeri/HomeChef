const express = require('express');
const Dish = require('../models/dish');
const router = express.Router();

// ✅ GET /api/dishes - Get all dishes with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 12; // Dishes per page
    const skip = (page - 1) * limit;

    const totalDishes = await Dish.countDocuments();
    const totalPages = Math.ceil(totalDishes / limit);

    const dishes = await Dish.find()
      .populate('chefId', '_id name email')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      dishes,
      currentPage: page,
      totalPages,
      totalDishes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch dishes', error });
  }
});

// ✅ POST /api/dishes/add - Add a new dish
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

// ✅ PUT /api/dishes/rate/:id - Update dish rating
router.put('/rate/:id', async (req, res) => {
  try {
    const dishId = req.params.id;
    const { rating } = req.body;

    const updatedDish = await Dish.findByIdAndUpdate(dishId, { rating }, { new: true });

    if (!updatedDish) return res.status(404).json({ message: 'Dish not found' });

    res.status(200).json({ message: 'Rating updated', dish: updatedDish });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Failed to update rating', error });
  }
});

module.exports = router;
