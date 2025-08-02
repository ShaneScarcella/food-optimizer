import { useState } from 'react';
import apiClient from '../services/apiService';

function MealPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setError('');
    setWeeklyPlan(null);
    try {
      // The request body is empty for now
      const response = await apiClient.post('/meal-plans/generate', {});
      setWeeklyPlan(response.data);
    } catch (err) {
      setError('Failed to generate meal plan. Please add more foods to the database.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Weekly Meal Plan Generator</h2>
      <button onClick={handleGeneratePlan} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate My Weekly Plan'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weeklyPlan && (
        <div>
          <h3>Your 7-Day Plan</h3>
          {weeklyPlan.dailyPlans.map((dailyPlan, index) => (
            <div key={index}>
              <h4>{dailyPlan.day}</h4>
              {dailyPlan.meals.map((meal, mealIndex) => (
                <div key={mealIndex}>
                  <h5>{meal.name} (Approx. {Math.round(meal.totalCalories)} kcal)</h5>
                  <ul>
                    {meal.foods.map(food => (
                      <li key={food.id}>{food.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MealPlanPage;