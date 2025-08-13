import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';

function AnalyticsPage() {
  const [averageCalories, setAverageCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get('/analytics/average-calories');
        setAverageCalories(response.data.averageDailyCalories);
      } catch (err) {
        setError('Could not load analytics data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Your Progress & Analytics</h2>
      <div>
        <h3>Average Daily Calorie Intake</h3>
        <p>{Math.round(averageCalories)} kcal / day</p>
      </div>
    </div>
  );
}

export default AnalyticsPage;