# 🌤️ Weather-Aware Order Processing System

A sophisticated logistics management platform that autonomously adjusts order statuses based on real-time global weather conditions. This system demonstrates a high-performance, asynchronous React & Node.js architecture with parallelized external API orchestration.

---

## 🌟 Core Features

### 📡 High-Performance Data Orchestration
- **Parallel Weather Fetching**: Utilizes `Promise.all` to fetch weather data for multiple cities concurrently, significantly reducing batch processing time.
- **Batched API Integration**: Optimized to handle global cities, minimizing redundant API requests by processing unique destinations first.

### 🧠 Intelligent Decision Engine
- **Strategy Selection**: Automatically classifies shipments as `Shipped` or `Delayed` based on critical weather conditions (Rain, Snow, Extreme, etc.).
- **Smart Notification Generation**: Dynamically crafts professional, varied AI-suggested messages for customers, avoiding repetitive responses and improving the user experience.

### 🍱 Robust Enterprise Backend
- **Modular Architecture**: Clean separation of concerns into Controllers, Services, and Routes.
- **Self-Healing Logic**: Built-in exponential backoff retry mechanism for weather API calls to handle transient network issues or rate limits.
- **Detailed Audit Trail**: Every processed order includes a `processed_at` timestamp and snapshot of weather data (`temp`, `condition`).

### 🎨 Premium React Interface
- **Modern Glassmorphism Design**: High-end visual aesthetic with smooth micro-animations and responsive layouts.
- **Unified Dashboard**: Integrates general weather insights (forecast, history) with a specialized logistics control panel.
- **Real-Time State Feedback**: Dynamic loading states, processing inhibitors, and sync-timers to ensure user confidence.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Axios, Lucide Icons, Framer Motion (concept) |
| **Backend** | Node.js, Express, Dotenv, File System API |
| **Services** | OpenWeatherMap API, WeatherAPI.com |
| **Styling** | Vanilla CSS (Modern CSS3 Variables, Glassmorphism) |

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- npm or yarn

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
OPENWEATHER_API_KEY=your_openweather_key_here
PORT=5000
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 4. Frontend Setup
```bash
cd ..
npm install
npm run dev
```

---

## 🏗️ System Architecture

1.  **Request**: Frontend triggers `POST /api/process-orders`.
2.  **Aggregation**: Backend reads `orders.json` and identifies unique global destinations.
3.  **Parallel Fetch**: `WeatherService` executes concurrent API calls with retry logic.
4.  **Transformation**: `OrderService` maps weather data to orders, generates smart messages, and adds audit timestamps.
5.  **Persistence**: Updated results are saved to `updated_orders.json`.
6.  **Response**: Frontend receives structured JSON payload and updates the dashboard with fresh logistics data.

---

## 📊 Error Handling Protocols

- **Invalid City Identifiers**: Identified during the API call; the order status is set to `Error` with a user-friendly descriptive message.
- **API Unavailability**: The retry mechanism attempts 3 times with exponential backoff before reporting a timeout.
- **Frontend Disconnect**: The UI detects backend unavailability and prompts the user to verify the status of the local server.

---

## 🔮 Future Enhancements

- **PostgreSQL Integration**: Migrate from JSON files to a relational database for real-time querying.
- **WebHooks**: Automatically notify customers via email/SMS when weather causes a delay.
- **Global Map Visualization**: Integrate Leaflet.js to pinpoint delayed shipments on a live global map.
- **Admin Authentication**: Secure the processing endpoint with JWT-based auth.

---

Designed for performance and reliability by **Sanjay**. 🚀
