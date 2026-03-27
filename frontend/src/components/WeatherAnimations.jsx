import { useEffect, useState } from 'react';
import './WeatherAnimations.css';

function WeatherAnimations({ condition }) {
    const [raindrops, setRaindrops] = useState([]);
    const [clouds, setClouds] = useState([]);
    const [showLightning, setShowLightning] = useState(false);

    const conditionLower = condition.toLowerCase();
    const isRaining = conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower');
    const isThunderstorm = conditionLower.includes('thunder') || conditionLower.includes('storm');
    const isCloudy = conditionLower.includes('cloud') || conditionLower.includes('overcast');

    // Generate raindrops
    useEffect(() => {
        if (isRaining) {
            const drops = Array.from({ length: 100 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 0.5 + Math.random() * 0.5,
            }));
            setRaindrops(drops);
        } else {
            setRaindrops([]);
        }
    }, [isRaining]);

    // Generate clouds
    useEffect(() => {
        if (isCloudy || isRaining) {
            const cloudArray = Array.from({ length: 5 }, (_, i) => ({
                id: i,
                top: 10 + Math.random() * 30,
                delay: Math.random() * 5,
                duration: 20 + Math.random() * 10,
            }));
            setClouds(cloudArray);
        } else {
            setClouds([]);
        }
    }, [isCloudy, isRaining]);

    // Lightning effect
    useEffect(() => {
        if (isThunderstorm) {
            const lightningInterval = setInterval(() => {
                setShowLightning(true);
                setTimeout(() => setShowLightning(false), 200);
            }, 3000 + Math.random() * 4000);

            return () => clearInterval(lightningInterval);
        }
    }, [isThunderstorm]);

    return (
        <div className="weather-animations">
            {/* Rain */}
            {isRaining && (
                <div className="rain-container">
                    {raindrops.map((drop) => (
                        <div
                            key={drop.id}
                            className="raindrop"
                            style={{
                                left: `${drop.left}%`,
                                animationDelay: `${drop.delay}s`,
                                animationDuration: `${drop.duration}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Clouds */}
            {clouds.length > 0 && (
                <div className="clouds-container">
                    {clouds.map((cloud) => (
                        <div
                            key={cloud.id}
                            className="cloud"
                            style={{
                                top: `${cloud.top}%`,
                                animationDelay: `${cloud.delay}s`,
                                animationDuration: `${cloud.duration}s`,
                            }}
                        >
                            ☁️
                        </div>
                    ))}
                </div>
            )}

            {/* Lightning */}
            {isThunderstorm && showLightning && (
                <div className="lightning-flash" />
            )}
        </div>
    );
}

export default WeatherAnimations;
