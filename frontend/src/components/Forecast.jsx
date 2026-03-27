import { Calendar, Thermometer, Droplets, Wind } from 'lucide-react';
import './Forecast.css';

function Forecast({ data }) {
    const { forecast, alerts } = data;

    return (
        <div className="forecast fade-in">
            {/* Alerts */}
            {alerts && alerts.alert && alerts.alert.length > 0 && (
                <div className="glass-card alert-card">
                    <h3>⚠️ Weather Alerts</h3>
                    {alerts.alert.map((alert, index) => (
                        <div key={index} className="alert-item">
                            <h4>{alert.headline}</h4>
                            <p>{alert.desc}</p>
                            <p className="alert-time">
                                {new Date(alert.effective).toLocaleString()} - {new Date(alert.expires).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* 3-Day Forecast */}
            <h2 className="forecast-title">3-Day Weather Forecast</h2>
            <div className="forecast-grid">
                {forecast.forecastday.map((day, index) => (
                    <div key={index} className="glass-card forecast-card">
                        <div className="forecast-header">
                            <Calendar size={20} />
                            <h3>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                        </div>

                        <img
                            src={`https:${day.day.condition.icon}`}
                            alt={day.day.condition.text}
                            className="forecast-icon"
                        />

                        <p className="forecast-condition">{day.day.condition.text}</p>

                        <div className="forecast-temps">
                            <div className="temp-high">
                                <Thermometer size={18} />
                                <span>{Math.round(day.day.maxtemp_c)}°C</span>
                            </div>
                            <div className="temp-low">
                                <Thermometer size={18} />
                                <span>{Math.round(day.day.mintemp_c)}°C</span>
                            </div>
                        </div>

                        <div className="forecast-details">
                            <div className="forecast-detail-item">
                                <Droplets size={16} />
                                <span>Rain: {day.day.daily_chance_of_rain}%</span>
                            </div>
                            <div className="forecast-detail-item">
                                <Wind size={16} />
                                <span>{day.day.maxwind_kph} km/h</span>
                            </div>
                        </div>

                        {/* Hourly Forecast Preview */}
                        <div className="hourly-preview">
                            <h4>Hourly</h4>
                            <div className="hourly-grid">
                                {day.hour.filter((_, i) => i % 6 === 0).map((hour, hourIndex) => (
                                    <div key={hourIndex} className="hourly-item">
                                        <p className="hourly-time">
                                            {new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' })}
                                        </p>
                                        <img
                                            src={`https:${hour.condition.icon}`}
                                            alt={hour.condition.text}
                                            className="hourly-icon"
                                        />
                                        <p className="hourly-temp">{Math.round(hour.temp_c)}°</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="additional-details">
                            <div className="detail-row">
                                <span>Humidity:</span>
                                <span>{day.day.avghumidity}%</span>
                            </div>
                            <div className="detail-row">
                                <span>UV Index:</span>
                                <span>{day.day.uv}</span>
                            </div>
                            <div className="detail-row">
                                <span>Sunrise:</span>
                                <span>{day.astro.sunrise}</span>
                            </div>
                            <div className="detail-row">
                                <span>Sunset:</span>
                                <span>{day.astro.sunset}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Forecast;
