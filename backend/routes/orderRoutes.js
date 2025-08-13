const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(authorize('customer'), createOrder);

router.get('/myorders', getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(authorize('provider'), updateOrderStatus);

router.route('/:id/payment')
  .put(authorize('provider'), updatePaymentStatus);

module.exports = router; 