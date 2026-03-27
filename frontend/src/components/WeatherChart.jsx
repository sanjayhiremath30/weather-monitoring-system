import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeatherChart.css';

function WeatherChart({ data }) {
    // Prepare data for temperature chart
    const tempData = data.forecast.forecastday.map((day) => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        maxTemp: Math.round(day.day.maxtemp_c),
        minTemp: Math.round(day.day.mintemp_c),
        avgTemp: Math.round(day.day.avgtemp_c),
    }));

    // Prepare data for precipitation and humidity
    const precipData = data.forecast.forecastday.map((day) => ({
        date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        precipitation: day.day.totalprecip_mm,
        humidity: day.day.avghumidity,
        rainChance: day.day.daily_chance_of_rain,
    }));

    // Prepare hourly data for first day
    const hourlyData = data.forecast.forecastday[0].hour.map((hour) => ({
        time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
        temp: Math.round(hour.temp_c),
        feelsLike: Math.round(hour.feelslike_c),
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}{entry.unit || ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="weather-chart fade-in">
            <h2 className="chart-title">Weather Trends & Analytics</h2>

            {/* Temperature Trend */}
            <div className="glass-card chart-card">
                <h3>📈 Temperature Trend (3 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tempData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="maxTemp"
                            stroke="#ffeb3b"
                            strokeWidth={3}
                            name="Max Temp (°C)"
                            dot={{ fill: '#ffeb3b', r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="avgTemp"
                            stroke="#4caf50"
                            strokeWidth={3}
                            name="Avg Temp (°C)"
                            dot={{ fill: '#4caf50', r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="minTemp"
                            stroke="#81d4fa"
                            strokeWidth={3}
                            name="Min Temp (°C)"
                            dot={{ fill: '#81d4fa', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Precipitation & Humidity */}
            <div className="glass-card chart-card">
                <h3>💧 Precipitation & Humidity</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={precipData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="precipitation"
                            stroke="#03a9f4"
                            fill="#03a9f4"
                            fillOpacity={0.6}
                            name="Precipitation (mm)"
                        />
                        <Area
                            type="monotone"
                            dataKey="humidity"
                            stroke="#9c27b0"
                            fill="#9c27b0"
                            fillOpacity={0.4}
                            name="Humidity (%)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Hourly Temperature */}
            <div className="glass-card chart-card">
                <h3>⏰ Today's Hourly Temperature</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="time" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#ff9800"
                            strokeWidth={2}
                            name="Temperature (°C)"
                            dot={{ fill: '#ff9800', r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="feelsLike"
                            stroke="#e91e63"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Feels Like (°C)"
                            dot={{ fill: '#e91e63', r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Statistics Summary */}
            <div className="glass-card stats-card">
                <h3>📊 3-Day Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <p className="stat-label">Highest Temp</p>
                        <p className="stat-value">
                            {Math.max(...tempData.map((d) => d.maxTemp))}°C
                        </p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Lowest Temp</p>
                        <p className="stat-value">
                            {Math.min(...tempData.map((d) => d.minTemp))}°C
                        </p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Total Precipitation</p>
                        <p className="stat-value">
                            {precipData.reduce((sum, d) => sum + d.precipitation, 0).toFixed(1)} mm
                        </p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-label">Avg Humidity</p>
                        <p className="stat-value">
                            {Math.round(precipData.reduce((sum, d) => sum + d.humidity, 0) / precipData.length)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherChart;
