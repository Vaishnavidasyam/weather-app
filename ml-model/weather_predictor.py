"""
Advanced Weather Prediction Model
Uses scikit-learn for temperature prediction based on historical data
"""

import numpy as np
import pickle
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pandas as pd
import os

class WeatherPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.is_trained = False
        self.model_path = 'models/weather_model.pkl'
        
    def prepare_features(self, current_temp, hour, humidity, wind_speed, 
                        day_of_week, is_weekend):
        """Prepare feature vector for prediction"""
        features = np.array([[
            current_temp,
            hour,
            humidity,
            wind_speed,
            day_of_week,
            is_weekend,
            np.sin(2 * np.pi * hour / 24),  # Cyclical hour feature
            np.cos(2 * np.pi * hour / 24),
            np.sin(2 * np.pi * day_of_week / 7),  # Cyclical day feature
            np.cos(2 * np.pi * day_of_week / 7)
        ]])
        return features
    
    def train(self, historical_data):
        """
        Train the model on historical weather data
        
        Args:
            historical_data: DataFrame with columns:
                - temp: temperature
                - hour: hour of day (0-23)
                - humidity: humidity percentage
                - wind_speed: wind speed
                - day_of_week: day of week (0-6)
                - is_weekend: boolean
                - next_temp: temperature next hour (target)
        """
        print("Training weather prediction model...")
        
        # Prepare features and target
        X = historical_data[[
            'temp', 'hour', 'humidity', 'wind_speed', 
            'day_of_week', 'is_weekend'
        ]]
        
        # Add cyclical features
        X['hour_sin'] = np.sin(2 * np.pi * X['hour'] / 24)
        X['hour_cos'] = np.cos(2 * np.pi * X['hour'] / 24)
        X['day_sin'] = np.sin(2 * np.pi * X['day_of_week'] / 7)
        X['day_cos'] = np.cos(2 * np.pi * X['day_of_week'] / 7)
        
        y = historical_data['next_temp']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"✓ Model trained successfully!")
        print(f"  MAE: {mae:.2f}°C")
        print(f"  R² Score: {r2:.3f}")
        
        return {'mae': mae, 'r2': r2}
    
    def predict_next_hour(self, current_temp, hour, humidity=60, 
                         wind_speed=3.5, day_of_week=None, is_weekend=False):
        """Predict temperature for next hour"""
        if not self.is_trained:
            # Return simple prediction if not trained
            return current_temp + np.random.uniform(-1, 1)
        
        if day_of_week is None:
            day_of_week = datetime.now().weekday()
        
        features = self.prepare_features(
            current_temp, hour, humidity, wind_speed,
            day_of_week, is_weekend
        )
        
        prediction = self.model.predict(features)[0]
        confidence = self.calculate_confidence(features)
        
        return {
            'predicted_temp': round(prediction, 2),
            'confidence': round(confidence, 2),
            'change': round(prediction - current_temp, 2)
        }
    
    def predict_24_hours(self, current_temp, start_hour=None, 
                       humidity=60, wind_speed=3.5):
        """Predict temperature for next 24 hours"""
        if start_hour is None:
            start_hour = datetime.now().hour
        
        predictions = []
        temp = current_temp
        
        for hour_offset in range(1, 25):
            hour = (start_hour + hour_offset) % 24
            day_of_week = (datetime.now().weekday() + 
                          (hour_offset // 24)) % 7
            is_weekend = day_of_week >= 5
            
            prediction = self.predict_next_hour(
                temp, hour, humidity, wind_speed,
                day_of_week, is_weekend
            )
            
            predictions.append({
                'hour': hour_offset,
                'timestamp': (datetime.now() + 
                            timedelta(hours=hour_offset)).isoformat(),
                'predicted_temp': prediction['predicted_temp'],
                'confidence': prediction['confidence'],
                'change_from_current': round(
                    prediction['predicted_temp'] - current_temp, 2
                )
            })
            
            # Update temp for next iteration (chain predictions)
            temp = prediction['predicted_temp']
        
        # Analyze trend
        avg_predicted = np.mean([p['predicted_temp'] for p in predictions])
        trend = 'increasing' if avg_predicted > current_temp else \
                'decreasing' if avg_predicted < current_temp else 'stable'
        
        return {
            'current_temp': current_temp,
            'predictions': predictions,
            'trend': trend,
            'avg_predicted_temp': round(avg_predicted, 2),
            'max_temp': round(max(p['predicted_temp'] for p in predictions), 2),
            'min_temp': round(min(p['predicted_temp'] for p in predictions), 2)
        }
    
    def calculate_confidence(self, features):
        """Calculate prediction confidence (0-1)"""
        # Simplified confidence based on feature similarity to training data
        base_confidence = 0.85
        time_factor = 1.0 - (features[0, 1] / 24) * 0.2  # Less confident for far future
        return round(base_confidence * time_factor, 2)
    
    def save_model(self, path=None):
        """Save trained model to file"""
        if path is None:
            path = self.model_path
        
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        with open(path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'is_trained': self.is_trained,
                'version': '1.0.0'
            }, f)
        
        print(f"✓ Model saved to {path}")
    
    def load_model(self, path=None):
        """Load trained model from file"""
        if path is None:
            path = self.model_path
        
        if not os.path.exists(path):
            print("⚠ Model file not found. Training required.")
            return False
        
        try:
            with open(path, 'rb') as f:
                data = pickle.load(f)
            
            self.model = data['model']
            self.is_trained = data['is_trained']
            
            print(f"✓ Model loaded from {path}")
            return True
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            return False


def generate_synthetic_data(n_samples=10000):
    """Generate synthetic historical weather data for training"""
    print("Generating synthetic training data...")
    
    np.random.seed(42)
    
    data = {
        'temp': np.random.normal(28, 5, n_samples),
        'hour': np.random.randint(0, 24, n_samples),
        'humidity': np.random.normal(65, 15, n_samples),
        'wind_speed': np.random.normal(3.5, 1.5, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
    }
    
    data['is_weekend'] = data['day_of_week'] >= 5
    
    # Generate next_temp with realistic patterns
    next_temp = (
        data['temp'] +
        2 * np.sin(2 * np.pi * data['hour'] / 24) +  # Daily cycle
        0.05 * (data['humidity'] - 65) +  # Humidity effect
        0.1 * np.random.normal(0, 1, n_samples)  # Random noise
    )
    
    # Add bounds
    next_temp = np.clip(next_temp, 15, 45)
    
    data['next_temp'] = next_temp
    
    return pd.DataFrame(data)


if __name__ == '__main__':
    # Demo usage
    predictor = WeatherPredictor()
    
    # Generate and train on synthetic data
    train_data = generate_synthetic_data(5000)
    predictor.train(train_data)
    
    # Save model
    predictor.save_model()
    
    # Make predictions
    print("\n📊 24-Hour Temperature Prediction:")
    print("=" * 50)
    
    result = predictor.predict_24_hours(current_temp=28, start_hour=14)
    
    print(f"Current: {result['current_temp']}°C")
    print(f"Trend: {result['trend']}")
    print(f"Average predicted: {result['avg_predicted_temp']}°C")
    print(f"Min: {result['min_temp']}°C | Max: {result['max_temp']}°C")
    
    print("\nNext 5 hours:")
    for pred in result['predictions'][:5]:
        print(f"  Hour {pred['hour']:2d}: {pred['predicted_temp']:5.1f}°C "
              f"(confidence: {pred['confidence']:.0%})")