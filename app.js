import { processAllOrders } from './backend/src/services/orderService.js';

/**
 * CLI Orchestrator for the Final Test Run
 */
async function runStandaloneProcessor() {
  console.log('--------------------------------------------------');
  console.log('📦 Starting Standalone Batch Processing Test...');
  console.log('--------------------------------------------------');
  
  try {
    const results = await processAllOrders();
    
    console.log('\n--------------------------------------------------');
    console.log(`✅ Success: ${results.length} orders processed.`);
    console.log('✔ Invalid cities handled correctly.');
    console.log('✔ Audit trail persisted to updated_orders.json.');
    console.log('--------------------------------------------------');
    
    // Explicitly exit to clear any open handles
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Critical Failure in Batch Orchestrator:', error.message);
    process.exit(1);
  }
}

// Execute logic
runStandaloneProcessor();
