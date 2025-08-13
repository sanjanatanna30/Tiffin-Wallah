const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide food item name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide food item description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide food item price']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  category: {
    type: String,
    required: [true, 'Please provide food category'],
    enum: [
      'breakfast',
      'lunch',
      'dinner',
      'snacks',
      'dessert',
      'beverage'
    ]
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FoodItem', foodItemSchema); 