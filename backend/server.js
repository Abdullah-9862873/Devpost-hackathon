const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config({ path: '../.env' });

const connectDB = require('./config/db');
const menuRoutes = require('./routes/menuRoutes');
const aiRoutes = require('./routes/aiRoutes.js');

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

// AI Routes
app.use('/api/ai', aiRoutes);

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
