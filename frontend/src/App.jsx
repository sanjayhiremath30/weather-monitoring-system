import { useState, useEffect } from 'react';
import axios from 'axios';
import OrderProcessing from './components/OrderProcessing';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherHistory from './components/WeatherHistory';
import WeatherChart from './components/WeatherChart';
import AISuggestions from './components/AISuggestions';
import BroadcastMode from './components/BroadcastMode';
import { Search, MapPin, Download, Share2, Sun, Wind, Droplets, Tv, Package } from 'lucide-react';
import './App.css';

// Central API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [city, setCity] = useState('London');
  const [searchInput, setSearchInput] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [orderResults, setOrderResults] = useState([]);
  const [processingOrders, setProcessingOrders] = useState(false);

  // Initial Fetch on component mount
  useEffect(() => {
    fetchUnifiedData(city);
  }, []);

  /**
   * Fetch consistent data from the professionalized backend.
   * This removes the need for client-side API keys and provides a unified model.
   */
  const fetchUnifiedData = async (cityName) => {
    setLoading(true);
    try {
      console.log(`[Dashboard] Orchestrating fetch for ${cityName} through Backend API...`);
      
      const response = await axios.get(`${API_BASE_URL}/weather`, {
        params: { city: cityName }
      });

      const { success, data } = response.data;
      
      if (success) {
        // Unified State Updates
        setCurrentWeather(data);
        setForecast(data); // Re-uses unified data structure for forecast
        
        // Simulate historical trend from current and forecast data for better UX
        const mockTrend = generateMockHistory(data);
        setHistory(mockTrend);
      }
    } catch (error) {
      console.error('[Dashboard] Error fetching unified data stream:', error);
      const errorMessage = error.response?.data?.error || error.message;
      alert(`⚠️ Systems Error: ${errorMessage}.\nMake sure your Node.js backend is active on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Professional Mock Generator: Generates realistic historical trends 
   * to ensure a "Top 1%" dashboard feel without paid history APIs.
   */
  function generateMockHistory(data) {
    const historicalEntries = [];
    const baseTemp = data.current.temp_c;
    
    for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        historicalEntries.push({
            location: data.location,
            forecast: {
                forecastday: [{
                    date: date.toISOString().split('T')[0],
                    day: {
                        maxtemp_c: baseTemp + (Math.random() * 4 - 2),
                        mintemp_c: baseTemp - (Math.random() * 4 + 2),
                        avgtemp_c: baseTemp + (Math.random() * 2 - 1),
                        maxwind_kph: data.current.wind_kph + (Math.random() * 5),
                        totalprecip_mm: Math.random() < 0.3 ? Math.random() * 10 : 0,
                        condition: i % 2 === 0 ? data.current.condition : { text: 'Partly Cloudy', icon: '//openweathermap.org/img/wn/02d.png' }
                    }
                }]
            }
        });
    }
    return historicalEntries.reverse();
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      fetchUnifiedData(searchInput);
    }
  };

  const handleShare = async () => {
    if (navigator.share && currentWeather) {
      try {
        await navigator.share({
            title: `Logistics Insight for ${currentWeather.location.name}`,
            text: `Local conditions: ${currentWeather.current.temp_c}°C - ${currentWeather.current.condition.text}. Strategy: Monitored.`,
            url: window.location.href,
        });
      } catch (err) { console.error('Share failure:', err); }
    } else { alert('Native sharing unavailable in this environment.'); }
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const element = document.getElementById('dashboard-view');

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#667eea' });
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`weather-audit-${city}.pdf`);
  };

  if (broadcastMode && forecast) {
    return <BroadcastMode 
              data={{ current: currentWeather.current, location: currentWeather.location, forecast, alerts: forecast.alerts }} 
              onExit={() => setBroadcastMode(false)} 
              city={city} 
           />;
  }

  return (
    <div className="app" id="dashboard-view">
      <div className="container">
        {/* Header - Corporate Styling */}
        <header className="header fade-in">
          <h1 className="title">🎙️ Sanjay's Intelligence Dashboard</h1>
          <p className="subtitle">Real-Time Global Logistics & Forecast Optimization</p>
          {forecast && (
            <button className="btn btn-primary broadcast-toggle" onClick={() => setBroadcastMode(true)}>
              <Tv size={20} /> Enter Stream Mode
            </button>
          )}
        </header>

        {/* Global Control Center */}
        <div className="search-section glass-card fade-in">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <MapPin size={20} />
              <input
                type="text"
                className="input-glass search-input"
                placeholder="Synchronize with another region..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-glow">
              <Search size={20} /> Pulse Connection
            </button>
          </form>
          <div className="action-buttons">
            <button className="btn btn-glass" onClick={handleShare}><Share2 size={18} /> Share Insight</button>
            <button className="btn btn-glass" onClick={handleDownloadPDF}><Download size={18} /> Export Audit</button>
          </div>
        </div>

        {/* Intelligence Partitioning Tabs */}
        <div className="tabs glass-card fade-in">
          {[
            { id: 'current', label: 'Monitor', icon: Sun },
            { id: 'forecast', label: 'Prediction', icon: Wind },
            { id: 'history', label: 'Past Analytics', icon: Droplets },
            { id: 'charts', label: 'Visual Analytics', icon: Package },
            { id: 'orders', label: 'Logistics Control', icon: Package }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Async State Loader */}
        {loading && (
          <div className="glass-card fade-in loading-screen">
            <div className="loading-spinner"></div>
            <p>Syncing global weather data streams...</p>
          </div>
        )}

        {/* Content Streams */}
        {!loading && (
          <div className="content-container slide-up">
            {activeTab === 'current' && currentWeather && <CurrentWeather data={currentWeather} />}
            {activeTab === 'forecast' && forecast && <Forecast data={forecast} />}
            {activeTab === 'history' && history.length > 0 && <WeatherHistory data={history} />}
            {activeTab === 'charts' && forecast && <WeatherChart data={forecast} />}
            {activeTab === 'orders' && (
              <OrderProcessing results={orderResults} setResults={setOrderResults} loading={processingOrders} setLoading={setProcessingOrders} />
            )}
            {/* Contextual Intelligence Header */}
            {currentWeather && <AISuggestions weather={currentWeather} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
