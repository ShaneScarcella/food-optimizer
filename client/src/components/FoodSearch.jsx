import { useState } from 'react';
import apiClient from '../services/apiService';

function FoodSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.get(`/foods/search?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search for foods.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Search for a Food</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Chicken Breast"
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {searchResults.map(food => (
          <div key={food.id}>
            <p>{food.name} - {food.calories} kcal</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodSearch;