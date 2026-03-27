import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchWeatherWithRetry } from './weatherService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to project root
const ORDERS_FILE = path.join(__dirname, '../../../orders.json');
const UPDATED_ORDERS_FILE = path.join(__dirname, '../../../updated_orders.json');

/**
 * Professional AI Message Variations
 * @param {string} customerName 
 * @param {string} city 
 * @param {string} condition 
 * @param {boolean} isDelayed 
 * @returns {string} 
 */
function generateProfessionalMessage(customerName, city, condition, isDelayed) {
  const firstName = customerName.split(' ')[0];
  
  const delayMessages = [
    `Hi ${firstName}, we've encountered ${condition.toLowerCase()} in ${city}, which has slightly delayed your delivery. We're prioritizing your order and will get it to you as soon as the weather permits. Thanks for your patience!`,
    `Hello ${firstName}, safety first! Your order to ${city} is experiencing a brief hold due to ${condition.toLowerCase()} weather. We'll resume the journey once conditions improve.`,
    `Hi ${firstName}, just a quick heads-up: ${condition.toLowerCase()} in ${city} is causing some logistics delays. Your order is safe and will arrive shortly!`,
  ];
  
  const shippedMessages = [
    `Great news, ${firstName}! The weather in ${city} is perfect for delivery. Your order has been shipped and is heading your way!`,
    `Hi ${firstName}, your order to ${city} is moving on schedule. Current local weather is favorable, and we expect a smooth delivery soon!`,
    `Hello ${firstName}, we've successfully dispatched your order to ${city}. Everything looks good for an on-time arrival.`,
  ];
  
  const messages = isDelayed ? delayMessages : shippedMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Main logical unit for processing a batch of orders
 * @returns {Promise<Array>}
 */
export async function processAllOrders() {
  console.log('[OrderService] Starting order processing sequence...');
  
  // 1. Load orders
  const rawData = await fs.readFile(ORDERS_FILE, 'utf-8');
  const orders = JSON.parse(rawData);
  console.log(`[OrderService] Successfully loaded ${orders.length} orders from source.`);

  // 2. Fetch unique cities to optimize API usage
  const uniqueCities = [...new Set(orders.map(o => o.city))];
  console.log(`[OrderService] Unique cities to fetch: ${uniqueCities.join(', ')}`);

  // Parallelizing API calls for performance
  const weatherPromises = uniqueCities.map(city => fetchWeatherWithRetry(city));
  const weatherResults = await Promise.all(weatherPromises);

  const weatherMap = {};
  uniqueCities.forEach((city, index) => {
    weatherMap[city] = weatherResults[index];
  });

  // 3. Process every order
  const processedOrders = orders.map(order => {
    const weatherData = weatherMap[order.city];
    
    // Add timestamp and basic weather info
    const baseInfo = {
      ...order,
      processed_at: new Date().toISOString(),
      weather: weatherData?.success ? {
        temp: weatherData.data.main.temp,
        condition: weatherData.data.weather[0].main,
        description: weatherData.data.weather[0].description
      } : null
    };

    if (!weatherData?.success) {
      return {
        ...baseInfo,
        status: 'Error',
        message: `Unable to confirm shipment due to city identification error: ${weatherData?.error || 'Unknown'}`
      };
    }

    const condition = weatherData.data.weather[0].main;
    const isDelayed = ['Rain', 'Snow', 'Extreme', 'Thunderstorm', 'Drizzle'].includes(condition);

    return {
      ...baseInfo,
      status: isDelayed ? 'Delayed' : 'Pending',
      message: generateProfessionalMessage(order.customer, order.city, condition, isDelayed)
    };
  });

  // 4. Save results
  await fs.writeFile(UPDATED_ORDERS_FILE, JSON.stringify(processedOrders, null, 2));
  console.log(`[OrderService] All orders processed and persisted to storage.`);
  
  return processedOrders;
}
