import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';

function DailyLog() {
  const [log, setLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a date object based on the user's local time
  const localDate = new Date();

  // Construct YYYY-MM-DD string
  const todayISO = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
  
  // Use local date for display
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = localDate.toLocaleDateString(undefined, options);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await apiClient.get(`/logs?date=${todayISO}`);
        setLog(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setLog({ entries: [] }); // Sets empty log if none exists
        } else {
          console.error("Failed to fetch daily log", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [todayISO]);

  if (isLoading) {
    return <p>Loading log...</p>;
  }

  return (
    <div>
      <h3>Today's Log - {formattedDate}</h3> 
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