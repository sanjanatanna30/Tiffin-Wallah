const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
exports.createOrder = async (req, res) => {
  try {
    const { provider, items, deliveryAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No order items'
      });
    }

    // Validate provider ID
    if (!provider || typeof provider !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid provider ID'
      });
    }

    // Verify all food items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const foodItem = await FoodItem.findById(item.foodItem);
      
      if (!foodItem) {
        return res.status(404).json({
          success: false,
          error: `Food item not found with id ${item.foodItem}`
        });
      }

      // Calculate price
      const itemPrice = foodItem.price * item.quantity;
      totalAmount += itemPrice;

      orderItems.push({
        foodItem: item.foodItem,
        quantity: item.quantity,
        price: foodItem.price // Use the price from the database to ensure accuracy
      });
    }

    // Create order
    const order = await Order.create({
      customer: req.user._id,
      provider, // This should now be a valid ObjectId string
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get orders for current user (customer or provider)
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    let orders;
    // Filter by user role (customer or provider)
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user._id })
        .populate({
          path: 'provider',
          select: 'fullName email phone'
        })
        .populate({
          path: 'items.foodItem',
          select: 'name price image'
        })
        .sort('-orderDate');
    } else if (req.user.role === 'provider') {
      orders = await Order.find({ provider: req.user._id })
        .populate({
          path: 'customer',
          select: 'fullName email phone'
        })
        .populate({
          path: 'items.foodItem',
          select: 'name price image'
        })
        .sort('-orderDate');
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'customer',
        select: 'fullName email phone'
      })
      .populate({
        path: 'provider',
        select: 'fullName email phone'
      })
      .populate({
        path: 'items.foodItem',
        select: 'name price image'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if the user is either the customer or the provider
    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      order.provider._id.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Provider
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide order status'
      });
    }

    // Find order
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is the provider of this order
    if (order.provider.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    // Update status
    order.status = status;

    // If status is delivered, set delivery time
    if (status === 'delivered') {
      order.deliveryTime = Date.now();
    }

    // Save changes
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Provider
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    // Find order
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is the provider of this order
    if (order.provider.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this order'
      });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;

    // Save changes
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 