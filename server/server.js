const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoutes = require('./routes/analyze');
const mealRoutes = require('./routes/meals');

// Load environment variables
dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongodb_uri = process.env.MONGODB_URI;
const masked_uri = mongodb_uri ? mongodb_uri.replace(/:([^@]+)@/, ':****@') : 'undefined';

mongoose.connect(mongodb_uri)
    .then(() => console.log(`✅ MongoDB connected: ${masked_uri}`))
    .catch(err => console.error(`❌ MongoDB connection error [${masked_uri}]:`, err));

// Routes
app.get('/', (req, res) => {
    res.send('AI Nutritionist API is running...');
});

app.use('/api/analyze', analyzeRoutes);
app.use('/api/meals', mealRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
