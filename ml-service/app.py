from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# Load trained model
model = joblib.load("model/isolation_forest.pkl")

# Create FastAPI app
app = FastAPI(title="SentinelGrid ML Service")

# Request schema
class SensorData(BaseModel):
    gas: float
    temp: float
    vibration: float

# Root route
@app.get("/")
def root():
    return {
        "message": "SentinelGrid ML Service Running"
    }

# Prediction route
@app.post("/predict")
def predict(data: SensorData):

    df = pd.DataFrame([{
        "gas": data.gas,
        "temp": data.temp,
        "vibration": data.vibration
    }])

    prediction = model.predict(df)[0]

    score = float(model.decision_function(df)[0])

    anomaly = bool(prediction == -1)

    # Risk mapping
    if score < -0.1:
        risk = "CRITICAL"
    elif score < 0:
        risk = "HIGH"
    elif score < 0.05:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "anomaly": anomaly,
        "score": round(score, 4),
        "risk": risk
    }