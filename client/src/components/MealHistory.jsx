import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Loader2 } from 'lucide-react';

const MealHistory = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const res = await axios.get(`${API_URL}/api/meals`);
            setMeals(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;

    if (meals.length === 0) return (
        <div className="p-8 text-center text-gray-500">
            <p>No meals tracked yet.</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-full p-4 overflow-y-auto max-h-[600px]">
            <h3 className="font-semibold text-gray-700 mb-4 px-2">Your Meal Log</h3>
            <div className="space-y-3">
                {meals.map((meal) => (
                    <div key={meal._id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3">
                        <img 
                            src={meal.imageUrl} 
                            alt={meal.foodName} 
                            className="w-20 h-20 rounded-lg object-cover bg-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800 truncate pr-2">{meal.foodName}</h4>
                                <span className="text-emerald-600 font-bold text-sm">{meal.calories} kcal</span>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                <span>P: {meal.macronutrients.protein}g</span>
                                <span>C: {meal.macronutrients.carbs}g</span>
                                <span>F: {meal.macronutrients.fats}g</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                <Clock size={10} />
                                <span>{new Date(meal.createdAt).toLocaleDateString()} • {new Date(meal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealHistory;
