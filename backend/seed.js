const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const MenuItem = require('./models/MenuItem');

dotenv.config({ path: '../.env' });

const seedData = [
    // Pizza
    { name: 'Margherita Pizza', price: 14.99, category: 'pizza', description: 'Fresh basil, tomato sauce, and buffalo mozzarella.' },
    { name: 'Pepperoni Blast', price: 16.99, category: 'pizza', description: 'Double pepperoni with extra mozzarella cheese.' },
    { name: 'Veggie Supreme', price: 15.99, category: 'pizza', description: 'Bell peppers, onions, olives, and mushrooms.' },

    // Pasta
    { name: 'Fettuccine Alfredo', price: 13.99, category: 'pasta', description: 'Creamy white sauce with parmesan and garlic.' },
    { name: 'Spaghetti Bolognese', price: 12.99, category: 'pasta', description: 'Rich meat sauce with herbs and fresh tomatoes.' },
    { name: 'Pesto Penne', price: 13.49, category: 'pasta', description: 'Fresh basil pesto with pine nuts and olive oil.' },

    // Traditionals
    { name: 'Chicken Fajita Pizza', price: 18.99, category: 'traditionals', description: 'Spicy fajita chicken, onions, and jalapeños.' },
    { name: 'Behari Kabab Pizza', price: 19.99, category: 'traditionals', description: 'Tender kabab chunks with special spicy sauce.' },
    { name: 'Chicken Tikka Pizza', price: 17.99, category: 'traditionals', description: 'Traditional tikka chunks with onions and green chilies.' },

    // Desserts & Beverages
    { name: 'Chocolate Lava Cake', price: 7.99, category: 'desserts', description: 'Warm chocolate cake with a gooey center.' },
    { name: 'New York Cheesecake', price: 8.49, category: 'desserts', description: 'Classic creamy cheesecake with strawberry topping.' },
    { name: 'Classic Coke', price: 2.49, category: 'desserts', description: 'Refreshing 500ml chilled soda.' },
];

const seedDB = async () => {
    try {
        await connectDB();
        await MenuItem.deleteMany();
        await MenuItem.insertMany(seedData);
        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
