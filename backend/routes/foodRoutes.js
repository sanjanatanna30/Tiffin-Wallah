const express = require('express');
const {
  createFoodItem,
  getFoodItems,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getProviderFoodItems
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getFoodItems)
  .post(protect, authorize('provider'), createFoodItem);

router.route('/:id')
  .get(getFoodItem)
  .put(protect, authorize('provider'), updateFoodItem)
  .delete(protect, authorize('provider'), deleteFoodItem);

router.get('/provider/:providerId', getProviderFoodItems);

module.exports = router; 