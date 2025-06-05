const mongoose = require('mongoose');

// Sub-schema for each order item
const orderItemSchema = new mongoose.Schema({
  _id: false,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  chefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+92\d{10}$/.test(v); // ✅ Must be +92XXXXXXXXXX
      },
      message: props => `${props.value} is not a valid phone number! Format must be +92XXXXXXXXXX`
    }
  },
  status: {
    type: String,
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
