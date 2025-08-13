# Tiffin Wallah - Cloud Kitchen Food Delivery Service

A full-stack MERN (MongoDB, Express.js, React.js, Node.js and Bootstrap) application for a cloud kitchen-based food delivery service.

## Features

- **User Authentication**: Secure login and registration with JWT
- **Dual User Roles**: Customer and Food Provider (Tiffin Service Provider)
- **Menu Management**: Providers can add, edit, and delete food items
- **Order System**: Customers can browse food items, add to cart, and place orders
- **Order Tracking**: Both customers and providers can track order status
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**:
  - React.js (Function components)
  - React Router for navigation
  - React Bootstrap for UI components
  - Context API for state management
  - Axios for API calls

- **Backend**:
  - Node.js with Express.js
  - MongoDB with Mongoose
  - JWT-based authentication
  - RESTful API architecture

## Pages

1. **Homepage** – Showcases the platform's value proposition with call-to-action buttons
2. **About Us** – Information about the platform's mission and team
3. **Login** – Single form for both customer and provider authentication
4. **Registration** – Separate forms for customer and provider registration
5. **Contact Us** – A form for users to send inquiries
6. **Cart** – For customers to manage their food selections before ordering
7. **Customer Dashboard** – Browse food items, place orders, and track deliveries
8. **Provider Dashboard** – Manage menu items and handle incoming orders

## Project Structure

```
tiffin-wallah/
├── backend/             # Node.js Express server
│   ├── config/          # Configuration files and JWT utilities
│   ├── controllers/     # API route controllers
│   ├── middleware/      # Custom middleware (auth, etc.)
│   ├── models/          # Mongoose data models
│   └── routes/          # API route definitions
│
└── frontend/            # React client
    ├── public/          # Static files
    └── src/             # React source files
        ├── api/         # API service calls
        ├── components/  # Reusable UI components
        │   └── layout/  # Header, Footer, etc.
        ├── pages/       # Page components
        └── utils/       # Utility functions & context
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user (customer or provider)
- `POST /api/users/login` - Login existing user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Food Items
- `GET /api/foods` - Get all food items
- `POST /api/foods` - Create new food item (providers only)
- `GET /api/foods/:id` - Get single food item
- `PUT /api/foods/:id` - Update food item (provider only)
- `DELETE /api/foods/:id` - Delete food item (provider only)
- `GET /api/foods/provider/:providerId` - Get all food items by provider

### Orders
- `POST /api/orders` - Create new order (customers only)
- `GET /api/orders/myorders` - Get user's orders (customer or provider)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (provider only)
- `PUT /api/orders/:id/payment` - Update payment status (provider only)

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd tiffin-wallah
```

2. Install backend dependencies and start server
```
cd backend
npm install
npm run server
```

3. Install frontend dependencies and start client
```
cd ../frontend
npm install
npm start
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

5. Access the application
   - Backend server: http://localhost:5000
   - Frontend client: http://localhost:3000

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React Bootstrap](https://react-bootstrap.github.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Unsplash](https://unsplash.com/) for placeholder images 