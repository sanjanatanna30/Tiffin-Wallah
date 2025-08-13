const FoodItem = require('../models/FoodItem');

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Provider
exports.createFoodItem = async (req, res) => {
  try {
    // Add provider to req.body
    req.body.provider = req.user._id;

    const foodItem = await FoodItem.create(req.body);

    res.status(201).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
exports.getFoodItems = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = FoodItem.find(JSON.parse(queryStr)).populate({
      path: 'provider',
      select: 'fullName email phone address'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await FoodItem.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const foodItems = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: foodItems.length,
      pagination,
      data: foodItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
exports.getFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate({
      path: 'provider',
      select: 'fullName email phone address'
    });

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        error: 'Food item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private/Provider
exports.updateFoodItem = async (req, res) => {
  try {
    let foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        error: 'Food item not found'
      });
    }

    // Make sure user is the food item provider
    if (foodItem.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this food item'
      });
    }

    foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: foodItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private/Provider
exports.deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({
        success: false,
        error: 'Food item not found'
      });
    }

    // Make sure user is the food item provider
    if (foodItem.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this food item'
      });
    }

    await foodItem.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get food items by provider
// @route   GET /api/foods/provider/:providerId
// @access  Public
exports.getProviderFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ provider: req.params.providerId });

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 