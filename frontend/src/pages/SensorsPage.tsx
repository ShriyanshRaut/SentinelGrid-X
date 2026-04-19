import { useEffect, useState } from "react";
import AppShell from "@/components/app/AppShell";
import SensorCard from "@/components/app/SensorCard";
import StateMessage from "@/components/app/StateMessage";
import { fetchSensors, type SensorReading } from "@/lib/api";

const SensorsPage = () => {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setError(null);
        const data = await fetchSensors();
        if (!cancelled) setSensors(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <AppShell
      title="Sensors"
      subtitle="Live readings from every connected device. Auto-refreshes every 5 seconds."
    >
      {loading && sensors.length === 0 ? (
        <StateMessage variant="loading" />
      ) : error ? (
        <StateMessage variant="error" message={error} />
      ) : sensors.length === 0 ? (
        <StateMessage
          variant="empty"
          message="No sensors are reporting yet."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sensors.map((s, i) => (
            <SensorCard
              key={s.timestamp ?? i} // ✅ FIXED
              sensor={s}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default SensorsPage; // also fixed typo