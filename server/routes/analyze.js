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
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ai-nutritionist' },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ error: 'Image upload failed' });
                }

                console.log('✅ Image uploaded to Cloudinary');

                try {
                    // 2. Analyze with Gemini
                    console.log('🤖 Analyzing with Gemini...');
                    const analysisResult = await analyzeFood(req.file.buffer, req.file.mimetype);
                    console.log('✅ Analysis complete');

                    // 3. Save to Database
                    const newMeal = new Meal({
                        ...analysisResult,
                        imageUrl: result.secure_url
                    });

                    await newMeal.save();
                    console.log('💾 Meal saved to DB');

                    res.json(newMeal);

                } catch (aiError) {
                    console.error('AI Analysis Error:', aiError);
                    res.status(500).json({ error: 'AI Analysis failed' });
                }
            }
        );

        stream.Readable.from(req.file.buffer).pipe(uploadStream);

    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
