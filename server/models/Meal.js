const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    macronutrients: {
        protein: Number,
        carbs: Number,
        fats: Number
    },
    imageUrl: {
        type: String,
        required: true
    },
    analysisText: String,
    healthyVerdict: Boolean,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Meal', MealSchema);
