const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ Place new order
router.post('/place', async (req, res) => {
  try {
    const { customerId, items, totalPrice, address, phone } = req.body;

    // Basic check for address and phone
    if (!address || !phone) {
      return res.status(400).json({ message: 'Address and phone number are required.' });
    }

    // Validate phone format
    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number. Use format +92XXXXXXXXXX' });
    }

    // ✅ Normalize items and ensure plain chefId
    const cleanedItems = items.map(item => {
      const plainChefId =
        item.chefId && typeof item.chefId === 'object'
          ? item.chefId._id
          : item.chefId;

      return {
        _id: item._id,
        name: item.name,
        price: item.price,
        chefId: plainChefId
      };
    });

    console.log('📦 Cleaned Items:', cleanedItems);

    const newOrder = new Order({
      customerId,
      items: cleanedItems,
      totalPrice,
      address,
      phone,
      status: 'pending',
      createdAt: new Date()
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });

  } catch (error) {
    console.error('❌ Order placement error:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

// ✅ Get all orders (admin view)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// ✅ Update order status
router.put('/update/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: 'Order updated', updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', err });
  }
});

// ✅ Get orders for specific chef only
router.get('/chef/:chefId', async (req, res) => {
  const chefId = req.params.chefId;

  try {
    const orders = await Order.find({
      items: { $elemMatch: { chefId: chefId } }
    }).populate('customerId', 'name email');

    res.status(200).json(orders);
  } catch (error) {
    console.error('❌ Error fetching chef-specific orders:', error);
    res.status(500).json({ message: 'Failed to fetch chef-specific orders', error });
  }
});

module.exports = router;
