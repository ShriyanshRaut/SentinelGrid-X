import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

np.random.seed(42)

# -----------------------------
# NORMAL SENSOR DATA
# -----------------------------

normal_samples = 1000

normal_gas = np.random.uniform(10, 60, normal_samples)
normal_temp = np.random.uniform(20, 35, normal_samples)
normal_vibration = np.random.choice([0, 1], normal_samples, p=[0.9, 0.1])

normal_data = pd.DataFrame({
    "gas": normal_gas,
    "temp": normal_temp,
    "vibration": normal_vibration
})

# -----------------------------
# ANOMALY DATA
# -----------------------------

anomaly_samples = 120

anomaly_gas = np.random.uniform(80, 100, anomaly_samples)
anomaly_temp = np.random.uniform(45, 80, anomaly_samples)
anomaly_vibration = np.random.choice([1, 2, 3, 4], anomaly_samples)

anomaly_data = pd.DataFrame({
    "gas": anomaly_gas,
    "temp": anomaly_temp,
    "vibration": anomaly_vibration
})

# -----------------------------
# COMBINED DATASET
# -----------------------------

dataset = pd.concat([normal_data, anomaly_data], ignore_index=True)

X = dataset[["gas", "temp", "vibration"]]

# -----------------------------
# TRAIN ISOLATION FOREST
# -----------------------------

model = IsolationForest(
    n_estimators=100,
    contamination=0.1,
    random_state=42
)

model.fit(X)

# -----------------------------
# SAVE MODEL
# -----------------------------

os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/isolation_forest.pkl")

print("\nModel trained successfully")
print("Saved to: model/isolation_forest.pkl")

# -----------------------------
# QUICK TEST
# -----------------------------

test_sample = pd.DataFrame([{
    "gas": 92,
    "temp": 67,
    "vibration": 3
}])

prediction = model.predict(test_sample)
score = model.decision_function(test_sample)

print("\nTest sample:", test_sample)

if prediction[0] == -1:
    print("Anomaly detected")
else:
    print("Normal reading")

print("Anomaly score:", score[0])