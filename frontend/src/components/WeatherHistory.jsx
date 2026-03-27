import { Calendar, Thermometer, CloudRain, Wind } from 'lucide-react';
import './WeatherHistory.css';

function WeatherHistory({ data }) {
    return (
        <div className="weather-history fade-in">
            <h2 className="history-title">7-Day Weather History</h2>
            <div className="history-grid">
                {data.map((dayData, index) => {
                    const day = dayData.forecast.forecastday[0];
                    return (
                        <div key={index} className="glass-card history-card">
                            <div className="history-header">
                                <Calendar size={20} />
                                <h3>
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </h3>
                            </div>

                            <div className="history-main">
                                <img
                                    src={`https:${day.day.condition.icon}`}
                                    alt={day.day.condition.text}
                                    className="history-icon"
                                />
                                <p className="history-condition">{day.day.condition.text}</p>
                            </div>

                            <div className="history-temps">
                                <div className="history-temp-item">
                                    <Thermometer size={18} className="temp-icon-high" />
                                    <span className="temp-high">{Math.round(day.day.maxtemp_c)}°C</span>
                                </div>
                                <div className="history-temp-item">
                                    <Thermometer size={18} className="temp-icon-low" />
                                    <span className="temp-low">{Math.round(day.day.mintemp_c)}°C</span>
                                </div>
                            </div>

                            <div className="history-details">
                                <div className="history-detail">
                                    <CloudRain size={16} />
                                    <span>Precipitation: {day.day.totalprecip_mm} mm</span>
                                </div>
                                <div className="history-detail">
                                    <Wind size={16} />
                                    <span>Wind: {day.day.maxwind_kph} km/h</span>
                                </div>
                                <div className="history-detail">
                                    <span>💧 Humidity: {day.day.avghumidity}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default WeatherHistory;
