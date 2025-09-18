import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function FoodSearch({ onFoodLogged }) {
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [allFoods, setAllFoods] = useState([]); // Holds the master list of all foods
  const [filteredFoods, setFilteredFoods] = useState([]); // Holds the foods that match the search term
  const [error, setError] = useState('');

  // Fetch all available foods when the component loads
  useEffect(() => {
    if (token) {
      const fetchAllFoods = async () => {
        try {
          const response = await apiClient.get('/foods/all-foods');
          setAllFoods(response.data);
          setFilteredFoods(response.data); // Initially, show all foods
        } catch (err) {
          setError('Failed to load your food list.');
          console.error(err);
        }
      };
      fetchAllFoods();
    }
  }, [token]);

  // Filter the list in real-time as the user types
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term) {
      setFilteredFoods(allFoods); // If search is empty, show all foods
    } else {
      const lowercasedTerm = term.toLowerCase();
      const filtered = allFoods.filter(food => 
        food.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredFoods(filtered);
    }
  };

  const handleLogFood = async (food) => {
    const entry = {
      foodId: food.id,
      name: food.name,
      servingQty: 1,
      servingSize: food.servingSize,
      calories: food.calories
    };

    const localDate = new Date();
    const today = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

    try {
      await apiClient.post('/logs/entry', { entry: entry, date: today });
      onFoodLogged();
      setSearchTerm(''); // Clear search after logging
      setFilteredFoods(allFoods); // Reset list to show all foods
    } catch (err) {
      setError('Failed to log food.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Search Your Foods</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Type to filter your foods..."
        style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '1rem' }}>
        {filteredFoods.map(food => (
          <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #444' }}>
            <span>{food.name} - {food.calories} kcal</span>
            <button onClick={() => handleLogFood(food)}>Log</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FoodSearch;