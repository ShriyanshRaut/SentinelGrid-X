from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

model = joblib.load("model/isolation_forest.pkl")

app = FastAPI(title="SentinelGrid ML Service")

class SensorData(BaseModel):
    gas: float
    temp: float
    vibration: float

@app.get("/")
def root():
    return {
        "message": "SentinelGrid ML Service Running"
    }

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

    if score < 0:
        risk = "CRITICAL"
    elif score < 0.03:
        risk = "HIGH"
    elif score < 0.08:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "anomaly": anomaly,
        "score": round(score, 4),
        "risk": risk
    }