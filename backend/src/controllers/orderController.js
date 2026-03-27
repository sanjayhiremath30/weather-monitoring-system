import { processAllOrders } from '../services/orderService.js';

/**
 * Controller for handling HTTP requests for order processing
 */
export async function handleProcessOrders(req, res) {
  try {
    console.log('[OrderController] Received process-orders request...');
    
    // Core logic
    const results = await processAllOrders();
    
    // Professional JSON response structure
    res.status(200).json({
      success: true,
      data: {
        processed_at: new Date().toISOString(),
        total_processed: results.length,
        orders: results
      },
      message: 'Batch processing completed successfully.'
    });
    
  } catch (error) {
    console.error('[OrderController] Error in batch processing:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to complete batch order processing due to an unexpected server event.'
    });
  }
}
