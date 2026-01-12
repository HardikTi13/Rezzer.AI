import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, Loader2 } from 'lucide-react';

const CameraCapture = ({ onCapture }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await processImage(file);
  };

  const processImage = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // In Vite, /api proxies to localhost:5000
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onCapture(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment" // Opens camera on mobile
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="flex flex-col items-center text-emerald-600 animate-pulse">
            <Loader2 size={48} className="animate-spin mb-2" />
            <p>Analyzing food...</p>
        </div>
      ) : (
        <>
            <button
                onClick={() => fileInputRef.current.click()}
                className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-emerald-300 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors group cursor-pointer"
            >
                <div className="p-4 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-emerald-500" />
                </div>
                <span className="font-medium text-emerald-700">Tap to Snap</span>
            </button>
            
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default CameraCapture;
