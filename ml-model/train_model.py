"""
Train the weather prediction model
Run this once to train and save the model
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from ml_model.weather_predictor import WeatherPredictor, generate_synthetic_data

def main():
    print("=" * 60)
    print("🌤️  Weather Prediction Model Training")
    print("=" * 60)
    
    # Initialize predictor
    predictor = WeatherPredictor()
    
    # Generate training data
    print("\n1. Generating training data...")
    train_data = generate_synthetic_data(n_samples=10000)
    print(f"   ✓ Generated {len(train_data)} samples")
    
    # Train model
    print("\n2. Training model...")
    metrics = predictor.train(train_data)
    
    # Save model
    print("\n3. Saving model...")
    predictor.save_model()
    
    # Test prediction
    print("\n4. Testing prediction...")
    test_result = predictor.predict_next_hour(
        current_temp=28,
        hour=14,
        humidity=65,
        wind_speed=3.5
    )
    
    print(f"   Current: 28°C")
    print(f"   Predicted: {test_result['predicted_temp']}°C")
    print(f"   Change: {test_result['change']:+.2f}°C")
    print(f"   Confidence: {test_result['confidence']:.0%}")
    
    print("\n" + "=" * 60)
    print("✅ Training Complete!")
    print("=" * 60)
    print(f"\nModel saved to: {predictor.model_path}")
    print(f"MAE: {metrics['mae']:.2f}°C")
    print(f"R² Score: {metrics['r2']:.3f}")

if __name__ == '__main__':
    main()