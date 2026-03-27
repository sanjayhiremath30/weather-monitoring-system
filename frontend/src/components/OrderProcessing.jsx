import React from 'react';
import axios from 'axios';
import { Package, CheckCircle, Clock, AlertTriangle, MessageSquare, Thermometer, RefreshCw } from 'lucide-react';
import './OrderProcessing.css';

const OrderProcessing = ({ results, setResults, loading, setLoading }) => {
  const [lastProcessedAt, setLastProcessedAt] = React.useState(null);

  const processOrders = async () => {
    setLoading(true);
    try {
      // Simulate slightly longer processing for a better UI experience
      const response = await axios.post('http://localhost:5000/api/process-orders');
      
      const { success, data } = response.data;
      if (success && data?.orders) {
        setResults(data.orders);
        setLastProcessedAt(data.processed_at);
      }
    } catch (error) {
      console.error('Error in batch processing:', error);
      alert('Failed to process orders. Check if your backend server is active on port 5000.');
    } finally {
      // Small cooldown to prevent rapid clicking
      setTimeout(() => setLoading(false), 500);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Shipped': return <CheckCircle className="status-icon shipped" />;
      case 'Delayed': return <Clock className="status-icon delayed" />;
      case 'Error': return <AlertTriangle className="status-icon error" />;
      default: return <RefreshCw className="status-icon pending spin" />;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="order-processing-container glass-card fade-in">
      <div className="order-header-premium">
        <div className="header-info">
          <h2><Package size={26} className="title-icon" /> Order Processing System</h2>
          <p>Autonomous Weather-Aware Logistics Strategy</p>
        </div>
        <div className="header-actions">
          {lastProcessedAt && (
            <span className="last-sync-badge">
              Last synced: {formatDate(lastProcessedAt)}
            </span>
          )}
          <button 
            className={`btn btn-primary btn-glow ${loading ? 'loading disabled' : ''}`} 
            onClick={processOrders}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-content">
                <RefreshCw size={18} className="spin" /> Processing Batch...
              </span>
            ) : (
              <span className="btn-content">
                <Package size={18} /> Execute Batch Processing
              </span>
            )}
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="results-table-wrapper-premium">
          <table className="order-results-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Destination</th>
                <th>Weather Analysis</th>
                <th>Strategy</th>
                <th>Smart Notification</th>
              </tr>
            </thead>
            <tbody>
              {results.map((order) => (
                <tr key={order.order_id} className={`order-row ${order.status.toLowerCase()}`}>
                  <td className="order-id-cell">
                    <span className="id-hash">#</span>{order.order_id}
                    <div className="customer-sub">{order.customer}</div>
                  </td>
                  <td>
                    <div className="city-cell">{order.city}</div>
                  </td>
                  <td>
                    {order.weather ? (
                      <div className="weather-detail-cell">
                        <span className="temp-badge">
                          <Thermometer size={12} /> {Math.round(order.weather.temp)}°C
                        </span>
                        <span className="condition-text">{order.weather.condition}</span>
                      </div>
                    ) : (
                      <span className="not-available">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge-premium ${order.status.toLowerCase()}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="ai-message-bubble">
                      <MessageSquare size={14} className="msg-icon" />
                      <p className="msg-text">{order.message}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state-premium">
          <div className="empty-illustration">
             <Package size={64} className="floating-icon" />
             <div className="shadow"></div>
          </div>
          <h3>System Ready for Processing</h3>
          <p>Initial order batch is loaded. Click the button above to analyze weather conditions and update logistics.</p>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;
