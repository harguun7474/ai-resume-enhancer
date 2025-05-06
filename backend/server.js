const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Create Express app
const app = express();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
      cb(new Error('Invalid file type. Please upload a PDF or DOCX file.'));
    } else {
      cb(null, true);
    }
  }
});

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS configuration
const corsOptions = {
  origin: [
    'https://polishai-airesumeenhancerrxlfzg-52ojbioea.vercel.app',
    'http://localhost:3000',
    'https://polishai-airesumeenhancerrxlfzg-3lbsjj2qi.vercel.app'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Deepseek API key
let deepseekApiKey;
try {
  deepseekApiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
  if (!deepseekApiKey) {
    console.error('Deepseek API key not found in environment variables');
    throw new Error('Deepseek API key is required');
  }
  console.log('Deepseek API key loaded successfully');
} catch (error) {
  console.error('Failed to load Deepseek API key:', error);
  // Don't throw here, we'll handle it in the endpoints
}

// Test Deepseek API connection
async function testDeepseekConnection() {
  if (!deepseekApiKey) {
    console.error('Cannot test Deepseek connection: API key not available');
    return false;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: "Hello"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API test failed: ${response.statusText}`);
    }

    console.log('Deepseek API connection test successful');
    return true;
  } catch (error) {
    console.error('Deepseek API connection test failed:', error);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const deepseekConnected = await testDeepseekConnection();
    res.json({
      status: 'ok',
      services: {
        deepseek: deepseekConnected
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  try {
    res.json({
      status: 'ok',
      message: 'Welcome to the Resume Enhancer API',
      endpoints: {
        health: '/api/health',
        improveResume: '/api/improve-resume'
      }
    });
  } catch (error) {
    console.error('Root endpoint error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// Resume upload endpoint
app.post('/api/improve-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please upload a PDF or DOCX file'
      });
    }

    if (!deepseekApiKey) {
      return res.status(500).json({ 
        error: 'Service temporarily unavailable',
        details: 'AI service not properly initialized'
      });
    }

    const file = req.file;
    console.log('Processing file:', {
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });

    let fileContent;
    try {
      if (file.mimetype === 'application/pdf') {
        const pdf = await pdfParse(file.buffer);
        fileContent = pdf.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        fileContent = result.value;
      }
    } catch (error) {
      console.error('Error extracting text from file:', error);
      return res.status(400).json({ 
        error: 'Failed to extract text from file',
        details: error.message
      });
    }

    if (!fileContent) {
      return res.status(400).json({ 
        error: 'No text content found in file',
        details: 'The uploaded file appears to be empty'
      });
    }

    // Process the file with Deepseek API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a resume improvement assistant. Analyze the resume and provide improvements."
            },
            {
              role: "user",
              content: fileContent
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Deepseek API error response:', errorText);
        return res.status(500).json({ 
          error: 'Failed to process resume with AI',
          details: `AI service error: ${response.statusText}`
        });
      }

      const result = await response.json();
      
      const responseData = {
        originalContent: fileContent,
        improvedContent: result.choices[0].message.content,
        suggestions: []
      };

      res.json(responseData);
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        return res.status(504).json({ 
          error: 'Request timeout',
          details: 'The AI service took too long to respond'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ 
      error: 'Failed to process resume',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: 'File upload error',
      details: err.message
    });
  }
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 