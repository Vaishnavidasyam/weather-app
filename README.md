# 🌤️ Advanced Weather App v2.0

A **professional, full-stack weather application** with AI-powered insights, ML predictions, interactive charts, and PWA support.

## ✨ Features

### Core Features

- ✅ Real-time weather updates for any location
- ✅ 24-hour hourly forecast
- ✅ 7-day daily forecast
- ✅ Search by city name
- ✅ Geolocation support
- ✅ Unit toggle (Celsius/Fahrenheit)

### Advanced Features

- ✅ **Interactive Charts**: Temperature, humidity, wind speed graphs (Chart.js)
- ✅ **AI Weather Insights**: Personalized clothing, activity, and health recommendations
- ✅ **ML Temperature Prediction**: 24-hour temperature forecast using RandomForest
- ✅ **Air Quality Index**: Real-time pollution levels
- ✅ **Saved Locations**: Save and switch between favorite cities
- ✅ **Dark/Light Theme**: Customizable UI themes
- ✅ **PWA Support**: Installable web app with offline support
- ✅ **User Authentication**: JWT-based auth with MongoDB
- ✅ **Responsive Design**: Mobile, tablet, desktop optimized

## 🛠️ Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Frontend   | React 18, Chart.js, React Icons, Toastify |
| Backend    | Node.js, Express, JWT                     |
| Database   | MongoDB                                   |
| Cache      | Redis (optional)                          |
| ML         | Python, scikit-learn, RandomForest        |
| Deployment | Docker, Docker Compose, GitHub Actions    |

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB (local or Atlas)
- OpenWeather API key (free)

### Step 1: Get OpenWeather API Key

1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Copy your API key from https://home.openweathermap.org/api_keys

### Step 2: Clone & Install Backend

```bash
cd advanced-weather-app/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create .env manually

# Edit .env and add:
# OPENWEATHER_API_KEY=your_api_key_here
# MONGODB_URI=mongodb://localhost:27017/advanced-weather
# JWT_SECRET=your_secret_key_change_this

# Start backend
npm start
```

Backend runs on: **http://localhost:5000**

### Step 3: Install & Train ML Model (Optional)

```bash
cd advanced-weather-app/ml-model

# Install Python dependencies
pip install -r requirements.txt

# Train the model
python train_model.py
```

### Step 4: Install & Run Frontend

```bash
cd advanced-weather-app/frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs on: **http://localhost:3000**

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# From project root
cd advanced-weather-app

# Start all services (MongoDB, Redis, Backend, Frontend)
docker-compose up -d

# Access app at:
# Frontend: http://localhost
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
# Redis: localhost:6379
```

### Build Images Manually

```bash
# Build backend
docker build -f docker/Dockerfile.backend -t weather-backend .

# Build frontend
docker build -f docker/Dockerfile.frontend -t weather-frontend .

# Run containers
docker-compose up -d
```

## 🚀 Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

1. **Frontend (Vercel)**:

   ```bash
   npm run build
   vercel deploy
   ```

2. **Backend (Render)**:
   - Connect GitHub repo
   - Set environment variables
   - Deploy

### Option 2: AWS

```bash
# Build and push to ECR
docker tag weather-backend:latest <account-id>.dkr.ecr.region.amazonaws.com/weather-backend
docker push <account-id>.dkr.ecr.region.amazonaws.com/weather-backend

# Deploy to ECS/EKS
```

## 📊 API Endpoints

### Weather
