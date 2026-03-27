import './NewsTicker.css';

function NewsTicker({ data }) {
    const { current, location, forecast } = data;

    const tickerItems = [
        `🌡️ CURRENT: ${Math.round(current.temp_c)}°C in ${location.name}`,
        `💨 WIND: ${current.wind_kph} km/h ${current.wind_dir}`,
        `💧 HUMIDITY: ${current.humidity}%`,
        `🌅 SUNRISE: ${forecast.forecastday[0].astro.sunrise}`,
        `🌇 SUNSET: ${forecast.forecastday[0].astro.sunset}`,
        `📊 PRESSURE: ${current.pressure_mb} mb`,
        `👁️ VISIBILITY: ${current.vis_km} km`,
        `☀️ UV INDEX: ${current.uv}`,
        `🔮 TOMORROW: ${forecast.forecastday[1].day.condition.text}, High ${Math.round(forecast.forecastday[1].day.maxtemp_c)}°C`,
    ];

    // Add alerts if available
    if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
        data.alerts.alert.forEach((alert) => {
            tickerItems.unshift(`⚠️ ALERT: ${alert.headline}`);
        });
    }

    const tickerText = tickerItems.join('   •   ');

    return (
        <div className="news-ticker">
            <div className="ticker-label">LIVE</div>
            <div className="ticker-content">
                <div className="ticker-text">
                    {tickerText}   •   {tickerText}   •   {tickerText}
                </div>
            </div>
        </div>
    );
}

export default NewsTicker;
