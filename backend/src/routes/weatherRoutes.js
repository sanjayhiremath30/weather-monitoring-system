import express from 'express';
import { resolveUnifiedWeather } from '../controllers/weatherController.js';

const router = express.Router();

/**
 * Endpoint for all dashboard weather data (Unified OWM)
 */
router.get('/', resolveUnifiedWeather);

export default router;
