import express from 'express';
import { handleProcessOrders } from '../controllers/orderController.js';

const router = express.Router();

/**
 * Main batch processing endpoint
 */
router.post('/process-orders', handleProcessOrders);

export default router;
