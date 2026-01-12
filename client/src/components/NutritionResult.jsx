import React from 'react';
import { ChevronLeft, Flame, Gauge, CheckCircle, AlertCircle } from 'lucide-react';

const NutritionResult = ({ data, onBack }) => {
  const { foodName, calories, macronutrients, healthyVerdict, analysisText, imageUrl } = data;

  return (
    <div className="bg-white min-h-full">
      <div className="relative h-48 w-full">
        <img 
            src={imageUrl} 
            alt={foodName} 
            className="w-full h-full object-cover"
        />
        <button 
            onClick={onBack}
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white"
        >
            <ChevronLeft size={24} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">{foodName}</h2>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                    healthyVerdict ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                    {healthyVerdict ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {healthyVerdict ? 'Healthy Choice' : 'Consume in Moderation'}
                </div>
            </div>
            <div className="text-right">
                <span className="block text-3xl font-bold text-emerald-600">{calories}</span>
                <span className="text-xs text-gray-500 uppercase font-tracking-wider">Calories</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
            <MacroCard label="Protein" value={`${macronutrients.protein}g`} color="bg-blue-50 text-blue-700" />
            <MacroCard label="Carbs" value={`${macronutrients.carbs}g`} color="bg-amber-50 text-amber-700" />
            <MacroCard label="Fats" value={`${macronutrients.fats}g`} color="bg-rose-50 text-rose-700" />
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Gauge size={16} /> AI Analysis
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {analysisText}
            </p>
        </div>
      </div>
    </div>
  );
};

const MacroCard = ({ label, value, color }) => (
    <div className={`p-3 rounded-lg text-center ${color}`}>
        <span className="block font-bold text-lg">{value}</span>
        <span className="text-xs opacity-80">{label}</span>
    </div>
);

export default NutritionResult;
