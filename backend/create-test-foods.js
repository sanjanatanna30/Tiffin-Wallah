const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');

const createTestFoods = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const connected = await connectDB();

    if (!connected) {
      console.error('Failed to connect to MongoDB. Check your connection settings.');
      process.exit(1);
    }

    // Find provider user
    const provider = await User.findOne({ role: 'provider' });
    
    if (!provider) {
      console.error('No provider user found. Please create a provider user first.');
      await mongoose.disconnect();
      return;
    }
    
    console.log(`Found provider: ${provider.fullName} (${provider._id})`);
    
    // Sample food items
    const foodItems = [
      {
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice cooked with tender chicken pieces and aromatic spices.',
        price: 12.99,
        image: 'chicken-biryani.jpg',
        category: 'lunch',
        isVegetarian: false,
        isAvailable: true,
        provider: provider._id
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Soft paneer cubes in a creamy tomato-based curry.',
        price: 10.99,
        image: 'paneer-butter-masala.jpg',
        category: 'dinner',
        isVegetarian: true,
        isAvailable: true,
        provider: provider._id
      },
      {
        name: 'Masala Dosa',
        description: 'A thin crispy crepe filled with spiced potatoes.',
        price: 8.99,
        image: 'masala-dosa.jpg',
        category: 'breakfast',
        isVegetarian: true,
        isAvailable: true,
        provider: provider._id
      },
      {
        name: 'Chole Bhature',
        description: 'Spicy chickpea curry served with fried bread.',
        price: 9.99,
        image: 'chole-bhature.jpg',
        category: 'lunch',
        isVegetarian: true,
        isAvailable: true,
        provider: provider._id
      },
      {
        name: 'Butter Chicken',
        description: 'Tender chicken pieces in a rich, buttery tomato sauce.',
        price: 13.99,
        image: 'butter-chicken.jpg',
        category: 'dinner',
        isVegetarian: false,
        isAvailable: true,
        provider: provider._id
      },
      {
        name: 'Veg Thali',
        description: 'A complete meal with rice, dal, vegetables, roti, and dessert.',
        price: 15.99,
        image: 'veg-thali.jpg',
        category: 'lunch',
        isVegetarian: true,
        isAvailable: true,
        provider: provider._id
      }
    ];
    
    // Clear existing food items
    await FoodItem.deleteMany({});
    console.log('Cleared existing food items');
    
    // Create food items
    const createdFoods = await FoodItem.insertMany(foodItems);
    
    console.log(`Created ${createdFoods.length} food items:`);
    createdFoods.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name} - $${food.price} (${food.category})`);
    });
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

  } catch (error) {
    console.error('Error creating test food items:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the function
createTestFoods(); 