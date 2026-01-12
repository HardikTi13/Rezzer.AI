import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import NutritionResult from './components/NutritionResult';
import MealHistory from './components/MealHistory';

function App() {
  const [view, setView] = useState('scan'); // 'scan' or 'history'
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleScanComplete = (data) => {
    setAnalysisResult(data);
    setView('result');
  };

  const resetScan = () => {
    setAnalysisResult(null);
    setView('scan');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-600">🥗 AI Nutritionist</h1>
        <nav className="flex gap-4">
          <button 
            onClick={() => setView('scan')}
            className={`font-medium ${view === 'scan' ? 'text-emerald-700 underline' : 'text-gray-500'}`}
          >
            Scan
          </button>
          <button 
            onClick={() => setView('history')}
            className={`font-medium ${view === 'history' ? 'text-emerald-700 underline' : 'text-gray-500'}`}
          >
            History
          </button>
        </nav>
      </header>

      <main className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
        {view === 'scan' && !analysisResult && (
          <div className="p-6 flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold mb-4">Snap a Meal</h2>
            <p className="text-gray-500 text-center mb-8">Take a photo of your food to get instant nutritional analysis.</p>
            <CameraCapture onCapture={handleScanComplete} />
          </div>
        )}

        {view === 'result' && analysisResult && (
          <NutritionResult data={analysisResult} onBack={resetScan} />
        )}

        {view === 'history' && (
          <MealHistory />
        )}
      </main>
    </div>
  );
}

export default App;
