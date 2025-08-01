import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';

function DailyLog() {
  const [log, setLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      const today = new Date().toISOString().split('T')[0]; // Date in YYYY-MM-DD format
      try {
        const response = await apiClient.get(`/logs?date=${today}`);
        setLog(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLog({ entries: [] }); // Is nothing logged for today
        } else {
          console.error("Failed to fetch daily log", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, []);

  if (isLoading) {
    return <p>Loading log...</p>;
  }

  return (
    <div>
      <h3>Today's Log</h3>
      {log && log.entries.length > 0 ? (
        <ul>
          {log.entries.map((entry, index) => (
            <li key={index}>
              {entry.name} - {entry.calories} kcal ({entry.servingQty} {entry.servingSize})
            </li>
          ))}
        </ul>
      ) : (
        <p>No entries logged for today.</p>
      )}
    </div>
  );
}

export default DailyLog;