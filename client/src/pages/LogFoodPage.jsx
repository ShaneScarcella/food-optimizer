import { useState } from 'react';
import FoodSearch from '../components/FoodSearch';
import CreateFoodForm from '../components/CreateFoodForm';
import DailyLog from '../components/DailyLog';

function LogFoodPage() {
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const handleFoodLogged = () => {
    setLogRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <h1>Log Your Food</h1>
      <p>Search for foods to add to your daily log, or create a new food item below.</p>
      <hr />
      <DailyLog key={logRefreshKey} />
      <FoodSearch onFoodLogged={handleFoodLogged} />
      <CreateFoodForm />
    </div>
  );
}

export default LogFoodPage;