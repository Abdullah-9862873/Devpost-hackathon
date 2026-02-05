const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('VoiceBite API is running...');
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
