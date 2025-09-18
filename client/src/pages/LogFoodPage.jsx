// client/src/pages/LogFoodPage.jsx

import { useState } from 'react';
import FoodSearch from '../components/FoodSearch';
import DailyLog from '../components/DailyLog';

function LogFoodPage() {
  const [logRefreshKey, setLogRefreshKey] = useState(0);

  const handleFoodLogged = () => {
    setLogRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div>
      <h1>Log Your Food</h1>
      <p>Search for foods and recipes to add to your daily log. If you can't find something, you can add it in the "Database" page.</p>
      <hr />
      <DailyLog key={logRefreshKey} />
      <FoodSearch onFoodLogged={handleFoodLogged} />
    </div>
  );
}

export default LogFoodPage;