import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './TomorrowTrend.css';

function TomorrowTrend({ forecast, current }) {
    const today = current.temp_c;
    const tomorrow = forecast.forecastday[1];
    const tomorrowAvg = tomorrow.day.avgtemp_c;
    const tomorrowMax = tomorrow.day.maxtemp_c;
    const tomorrowMin = tomorrow.day.mintemp_c;

    const tempDiff = tomorrowAvg - today;
    const percentChange = ((tempDiff / today) * 100).toFixed(1);

    let trendIcon;
    let trendText;
    let trendColor;

    if (tempDiff > 2) {
        trendIcon = <TrendingUp size={40} />;
        trendText = 'Rising';
        trendColor = '#ff6b6b';
    } else if (tempDiff < -2) {
        trendIcon = <TrendingDown size={40} />;
        trendText = 'Falling';
        trendColor = '#4ecdc4';
    } else {
        trendIcon = <Minus size={40} />;
        trendText = 'Stable';
        trendColor = '#95e1d3';
    }

    return (
        <div className="tomorrow-trend">
            <h2>Tomorrow's Forecast</h2>
            <div className="trend-content">
                <div className="trend-indicator" style={{ color: trendColor }}>
                    {trendIcon}
                    <span className="trend-label">{trendText}</span>
                    <span className="trend-change">
                        {tempDiff > 0 ? '+' : ''}{tempDiff.toFixed(1)}°C ({percentChange > 0 ? '+' : ''}{percentChange}%)
                    </span>
                </div>

                <div className="tomorrow-details">
                    <div className="tomorrow-card">
                        <img
                            src={`https:${tomorrow.day.condition.icon}`}
                            alt={tomorrow.day.condition.text}
                            className="tomorrow-icon"
                        />
                        <h3>{tomorrow.day.condition.text}</h3>
                    </div>

                    <div className="tomorrow-temps">
                        <div className="temp-box">
                            <span className="temp-label">High</span>
                            <span className="temp-value high">{Math.round(tomorrowMax)}°C</span>
                        </div>
                        <div className="temp-box">
                            <span className="temp-label">Low</span>
                            <span className="temp-value low">{Math.round(tomorrowMin)}°C</span>
                        </div>
                        <div className="temp-box">
                            <span className="temp-label">Avg</span>
                            <span className="temp-value avg">{Math.round(tomorrowAvg)}°C</span>
                        </div>
                    </div>

                    <div className="tomorrow-extra">
                        <div className="extra-item">
                            <span>Rain Chance:</span>
                            <span>{tomorrow.day.daily_chance_of_rain}%</span>
                        </div>
                        <div className="extra-item">
                            <span>Humidity:</span>
                            <span>{tomorrow.day.avghumidity}%</span>
                        </div>
                        <div className="extra-item">
                            <span>Wind:</span>
                            <span>{tomorrow.day.maxwind_kph} km/h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TomorrowTrend;
