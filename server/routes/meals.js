const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

router.get('/', async (req, res) => {
    try {
        const meals = await Meal.find().sort({ createdAt: -1 });
        res.json(meals);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

module.exports = router;
