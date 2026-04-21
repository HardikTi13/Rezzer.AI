const express = require('express');
const router = express.Router();
const multer = require('multer');
const Meal = require('../models/Meal');
const cloudinary = require('../utils/cloudinary');
const { analyzeFood } = require('../services/geminiService');
const stream = require('stream');

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }

        console.log('📸 Image received:', req.file.originalname);

        // 1. Upload to Cloudinary
        console.log('☁️ Uploading to Cloudinary...');
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ai-nutritionist' },
            async (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary Upload Error:', error);
                    return res.status(500).json({ error: 'Image upload to Cloudinary failed: ' + error.message });
                }

                console.log('✅ Image uploaded to Cloudinary:', result.secure_url);

                try {
                    // 2. Analyze with Gemini
                    console.log('🤖 Analyzing with Gemini...');
                    const analysisResult = await analyzeFood(req.file.buffer, req.file.mimetype);
                    console.log('✅ AI Analysis complete');

                    // 3. Save to Database
                    console.log('💾 Saving to Database...');
                    const newMeal = new Meal({
                        ...analysisResult,
                        imageUrl: result.secure_url
                    });

                    await newMeal.save();
                    console.log('✅ Meal saved to DB');

                    res.json(newMeal);

                } catch (aiError) {
                    console.error('❌ AI Analysis or DB Error:', aiError.message);
                    res.status(500).json({ 
                        error: 'Failed to analyze or save meal', 
                        details: aiError.message 
                    });
                }
            }
        );

        stream.Readable.from(req.file.buffer).pipe(uploadStream);

    } catch (err) {
        console.error('❌ Unexpected Server Error:', err);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

module.exports = router;
