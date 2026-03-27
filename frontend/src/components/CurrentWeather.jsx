import { Thermometer, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Navigation } from 'lucide-react';
import './CurrentWeather.css';

function CurrentWeather({ data }) {
    const { location, current } = data;

    return (
        <div className="current-weather fade-in">
            {/* Main Weather Card */}
            <div className="glass-card main-weather-card">
                <div className="location-info">
                    <h2>{location.name}, {location.country}</h2>
                    <p>{new Date(location.localtime).toLocaleString()}</p>
                </div>

                <div className="weather-main">
                    <div className="weather-icon-temp">
                        <img
                            src={`https:${current.condition.icon}`}
                            alt={current.condition.text}
                            className="weather-icon-large"
                        />
                        <div className="temperature">
                            <span className="temp-value">{Math.round(current.temp_c)}</span>
                            <span className="temp-unit">°C</span>
                        </div>
                    </div>
                    <div className="weather-description">
                        <h3>{current.condition.text}</h3>
                        <p>Feels like {Math.round(current.feelslike_c)}°C</p>
                    </div>
                </div>
            </div>

            {/* Weather Details Grid */}
            <div className="weather-details-grid">
                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Wind size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">Wind Speed</p>
                        <p className="detail-value">{current.wind_kph} km/h</p>
                        <p className="detail-extra">{current.wind_dir}</p>
                    </div>
                </div>

                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Droplets size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">Humidity</p>
                        <p className="detail-value">{current.humidity}%</p>
                    </div>
                </div>

                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Gauge size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">Pressure</p>
                        <p className="detail-value">{current.pressure_mb} mb</p>
                    </div>
                </div>

                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Eye size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">Visibility</p>
                        <p className="detail-value">{current.vis_km} km</p>
                    </div>
                </div>

                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Thermometer size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">UV Index</p>
                        <p className="detail-value">{current.uv}</p>
                    </div>
                </div>

                <div className="glass-card detail-card">
                    <div className="detail-icon">
                        <Navigation size={24} />
                    </div>
                    <div className="detail-info">
                        <p className="detail-label">Wind Gust</p>
                        <p className="detail-value">{current.gust_kph} km/h</p>
                    </div>
                </div>
            </div>

            {/* Air Quality */}
            {current.air_quality && (
                <div className="glass-card air-quality-card">
                    <h3>Air Quality Index</h3>
                    <div className="air-quality-grid">
                        <div className="aqi-item">
                            <p className="aqi-label">PM2.5</p>
                            <p className="aqi-value">{current.air_quality.pm2_5?.toFixed(1)}</p>
                        </div>
                        <div className="aqi-item">
                            <p className="aqi-label">PM10</p>
                            <p className="aqi-value">{current.air_quality.pm10?.toFixed(1)}</p>
                        </div>
                        <div className="aqi-item">
                            <p className="aqi-label">O3</p>
                            <p className="aqi-value">{current.air_quality.o3?.toFixed(1)}</p>
                        </div>
                        <div className="aqi-item">
                            <p className="aqi-label">NO2</p>
                            <p className="aqi-value">{current.air_quality.no2?.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrentWeather;
