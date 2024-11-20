const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { generateSpeech } = require('../services/googleTTS');
const fs = require('fs');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Supabase setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

router.post('/upload', upload.single('voiceFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
            .from('voice-files')
            .upload(`original/${Date.now()}-${req.file.originalname}`, req.file.buffer);

        if (error) throw error;

        res.json({ 
            success: true, 
            filePath: data.path 
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error uploading file',
            details: error.message 
        });
    }
});

router.post('/generate', async (req, res) => {
    try {
        const { text, originalVoicePath } = req.body;
        
        if (!text || !originalVoicePath) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Generate the new voice file
        const outputFileName = `${Date.now()}-output.mp3`;
        const generatedFilePath = await generateSpeech(text, outputFileName);

        // Upload generated file to Supabase
        const fileBuffer = fs.readFileSync(generatedFilePath);
        const { data, error } = await supabase.storage
            .from('voice-files')
            .upload(`generated/${outputFileName}`, fileBuffer);

        if (error) throw error;

        // Get the public URL for download
        const { publicURL } = supabase.storage
            .from('voice-files')
            .getPublicUrl(`generated/${outputFileName}`);

        res.json({ 
            success: true,
            downloadUrl: publicURL
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error generating voice file',
            details: error.message 
        });
    }
});

module.exports = router;
