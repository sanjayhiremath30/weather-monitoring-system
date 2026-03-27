import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY;
const city = 'London';

async function testKey() {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );
    console.log('SUCCESS:', response.data.weather[0].main);
  } catch (error) {
    console.log('FAILED:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) {
      console.log('REASON:', error.response.data.message);
    }
  }
}

testKey();
