import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function DatabasePage() {
  const { token } = useAuth();
  const [myFoodIds, setMyFoodIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch the user's current list of "My Foods" to know what's already added
  useEffect(() => {
    if (token) {
      const fetchMyFoodIds = async () => {
        try {
          const response = await apiClient.get('/users/me');
          setMyFoodIds(new Set(response.data.myFoodIds || []));
        } catch (error) {
          console.error("Failed to fetch user's food list", error);
        }
      };
      fetchMyFoodIds();
    }
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await apiClient.get(`/foods/search?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to search foods", error);
    }
  };

  const handleAddFood = async (foodId) => {
    try {
      await apiClient.post('/users/me/my-foods', { foodId });
      setMyFoodIds(prev => new Set(prev).add(foodId));
      setMessage('Food added to your list!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error("Failed to add food", error);
    }
  };

  const handleRemoveFood = async (foodId) => {
    try {
      await apiClient.delete(`/users/me/my-foods/${foodId}`);
      setMyFoodIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(foodId);
        return newSet;
      });
      setMessage('Food removed from your list!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error("Failed to remove food", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Explore Food Database</h2>
      <p>Search for global and personal foods to add to your cookbook.</p>
      
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search all foods..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Search</button>
      </form>
      
      {message && <p>{message}</p>}

      <div style={styles.list}>
        {searchResults.map(food => {
          const isAdded = myFoodIds.has(food.id);
          return (
            <div key={food.id} style={styles.listItem}>
              <span>{food.name} ({food.calories} kcal)</span>
              <button 
                onClick={() => isAdded ? handleRemoveFood(food.id) : handleAddFood(food.id)}
                style={isAdded ? styles.removeButton : styles.addButton}
              >
                {isAdded ? 'Remove' : 'Add'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
    container: { maxWidth: '800px', width: '100%', padding: '2rem', textAlign: 'center' },
    form: { display: 'flex', gap: '10px', marginBottom: '1rem', width: '100%' },
    input: { flexGrow: 1, padding: '0.8rem', fontSize: '1rem' },
    button: { padding: '0.8rem 1.5rem' },
    list: { width: '100%', textAlign: 'left' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' },
    addButton: { backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' },
    removeButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' }
};

export default DatabasePage;