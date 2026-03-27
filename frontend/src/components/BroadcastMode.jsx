import { useState, useEffect } from 'react';
import { Tv, Volume2, VolumeX } from 'lucide-react';
import WeatherAnimations from './WeatherAnimations';
import NewsTicker from './NewsTicker';
import TomorrowTrend from './TomorrowTrend';
import './BroadcastMode.css';

function BroadcastMode({ data, onExit, city }) {
    const [isMuted, setIsMuted] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const { current, location, forecast } = data;

    // Voice narration function
    const speakWeather = () => {
        if (isMuted || !window.speechSynthesis) return;

        const text = `Current temperature in ${location.name} is ${Math.round(current.temp_c)} degrees Celsius. ${current.condition.text}. Tomorrow's forecast: ${forecast.forecastday[1].day.condition.text} with a high of ${Math.round(forecast.forecastday[1].day.maxtemp_c)} degrees.`;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
    };

    // Auto-refresh and voice narration
    useEffect(() => {
        speakWeather(); // Speak on mount

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.location.reload(); // Refresh page
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            window.speechSynthesis.cancel();
        }
    };

    return (
        <div className="broadcast-mode">
            {/* Weather Animations */}
            <WeatherAnimations condition={current.condition.text} />

            {/* Exit and Mute Controls */}
            <div className="broadcast-controls">
                <button className="broadcast-btn" onClick={onExit}>
                    Exit Broadcast
                </button>
                <button className="broadcast-btn" onClick={toggleMute}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    {isMuted ? ' Unmute' : ' Mute'}
                </button>
                <div className="refresh-countdown">
                    Next refresh: {countdown}s
                </div>
            </div>

            {/* Main Broadcast Content */}
            <div className="broadcast-content">
                {/* Header */}
                <div className="broadcast-header">
                    <div className="broadcast-logo">
                        <Tv size={40} />
                        <h1>Sanjay's Weather Broadcasting</h1>
                    </div>
                    <div className="live-indicator">
                        <span className="live-dot"></span>
                        LIVE
                    </div>
                </div>

                {/* Main Weather Display */}
                <div className="broadcast-main">
                    <div className="location-display">
                        <h2>{location.name}, {location.country}</h2>
                        <p className="local-time">{new Date(location.localtime).toLocaleString()}</p>
                    </div>

                    <div className="current-display">
                        <div className="temp-display">
                            <span className="temp-large">{Math.round(current.temp_c)}</span>
                            <span className="temp-unit">°C</span>
                        </div>
                        <div className="condition-display">
                            <img
                                src={`https:${current.condition.icon}`}
                                alt={current.condition.text}
                                className="condition-icon-large"
                            />
                            <h3>{current.condition.text}</h3>
                        </div>
                    </div>

                    {/* Weather Details */}
                    <div className="broadcast-details">
                        <div className="detail-box">
                            <span className="detail-label">Feels Like</span>
                            <span className="detail-value">{Math.round(current.feelslike_c)}°C</span>
                        </div>
                        <div className="detail-box">
                            <span className="detail-label">Humidity</span>
                            <span className="detail-value">{current.humidity}%</span>
                        </div>
                        <div className="detail-box">
                            <span className="detail-label">Wind</span>
                            <span className="detail-value">{current.wind_kph} km/h</span>
                        </div>
                        <div className="detail-box">
                            <span className="detail-label">Pressure</span>
                            <span className="detail-value">{current.pressure_mb} mb</span>
                        </div>
                    </div>
                </div>

                {/* Tomorrow's Trend */}
                <TomorrowTrend forecast={forecast} current={current} />
            </div>

            {/* News Ticker */}
            <NewsTicker data={data} />
        </div>
    );
}

export default BroadcastMode;
