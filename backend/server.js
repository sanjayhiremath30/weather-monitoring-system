import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import orderRoutes from './src/routes/orderRoutes.js';
import weatherRoutes from './src/routes/weatherRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Global Middlewares
 */
app.use(cors());
app.use(express.json());

/**
 * Health Check / Root endpoint
 */
app.get('/', (req, res) => {
  res.status(200).json({
    name: "Weather-Aware Order Processing API",
    version: "2.1.0",
    status: "Healthy",
    message: "Welcome to the premium weather-integrated backend! ❄️🚀"
  });
});

/**
 * API Routes
 */
app.use('/api', orderRoutes);
app.use('/api/weather', weatherRoutes);

/**
 * 404 handler for unmatched routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The terminal point ${req.originalUrl} does not exist.`
  });
});

/**
 * Initialization Log
 */
app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`🚀 Server initialized on http://localhost:${PORT}`);
  console.log(`✅ Current Weather & Logistics ready for processing.`);
  console.log('--------------------------------------------------');
});
