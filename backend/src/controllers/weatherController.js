import { getUnifiedWeather } from '../services/weatherService.js';

/**
 * Controller to resolve unified weather (Current + Forecast + Air Pollution)
 */
export async function resolveUnifiedWeather(req, res) {
  const { city } = req.query;
  
  if (!city) {
    return res.status(400).json({ success: false, error: 'City name is required' });
  }

  try {
    const result = await getUnifiedWeather(city);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
        message: `System could not find weather details for location: ${city}`
      });
    }
    
  } catch (error) {
    console.error('[WeatherController] Exception in unified weather resolution:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
