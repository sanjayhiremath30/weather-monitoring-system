import { Umbrella, Sun, Wind, Snowflake, Shirt, Coffee } from 'lucide-react';
import './AISuggestions.css';

function AISuggestions({ weather }) {
    const { current } = weather;

    // AI-based suggestions logic
    const getSuggestions = () => {
        const suggestions = [];

        // Rain suggestion
        if (current.condition.text.toLowerCase().includes('rain') || current.precip_mm > 0) {
            suggestions.push({
                icon: <Umbrella size={24} />,
                title: 'Carry an Umbrella',
                description: `It's ${current.condition.text.toLowerCase()}. Don't forget your umbrella!`,
                color: '#03a9f4',
            });
        }

        // Temperature-based clothing suggestions
        if (current.temp_c < 10) {
            suggestions.push({
                icon: <Shirt size={24} />,
                title: 'Dress Warmly',
                description: `It's quite cold at ${Math.round(current.temp_c)}°C. Wear warm layers and a jacket.`,
                color: '#81d4fa',
            });
        } else if (current.temp_c > 30) {
            suggestions.push({
                icon: <Shirt size={24} />,
                title: 'Stay Cool',
                description: `It's hot at ${Math.round(current.temp_c)}°C. Wear light, breathable clothing and stay hydrated.`,
                color: '#ff9800',
            });
        }

        // UV Index suggestion
        if (current.uv >= 6) {
            suggestions.push({
                icon: <Sun size={24} />,
                title: 'UV Protection',
                description: `High UV index of ${current.uv}. Apply sunscreen and wear sunglasses.`,
                color: '#ffeb3b',
            });
        }

        // Wind suggestion
        if (current.wind_kph > 30) {
            suggestions.push({
                icon: <Wind size={24} />,
                title: 'Windy Conditions',
                description: `Strong winds at ${current.wind_kph} km/h. Secure loose items and be cautious outdoors.`,
                color: '#9c27b0',
            });
        }

        // Snow suggestion
        if (current.condition.text.toLowerCase().includes('snow')) {
            suggestions.push({
                icon: <Snowflake size={24} />,
                title: 'Winter Weather',
                description: 'Snowy conditions ahead. Drive carefully and dress warmly.',
                color: '#e3f2fd',
            });
        }

        // Air quality suggestion
        if (current.air_quality && current.air_quality.pm2_5 > 35) {
            suggestions.push({
                icon: <Wind size={24} />,
                title: 'Air Quality Alert',
                description: 'Poor air quality detected. Consider wearing a mask outdoors.',
                color: '#f44336',
            });
        }

        // General comfort suggestion
        if (current.temp_c >= 15 && current.temp_c <= 25 && !current.condition.text.toLowerCase().includes('rain')) {
            suggestions.push({
                icon: <Coffee size={24} />,
                title: 'Perfect Weather',
                description: 'Great weather for outdoor activities! Enjoy your day.',
                color: '#4caf50',
            });
        }

        return suggestions;
    };

    const suggestions = getSuggestions();

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="ai-suggestions fade-in">
            <h2 className="suggestions-title">🤖 AI Weather Suggestions</h2>
            <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="glass-card suggestion-card">
                        <div className="suggestion-icon" style={{ backgroundColor: suggestion.color }}>
                            {suggestion.icon}
                        </div>
                        <div className="suggestion-content">
                            <h3>{suggestion.title}</h3>
                            <p>{suggestion.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AISuggestions;
