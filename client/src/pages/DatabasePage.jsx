import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import CreateFoodForm from '../components/CreateFoodForm';
import CreateRecipeForm from '../components/CreateRecipeForm';

function DatabasePage() {
  const { token } = useAuth();
  const [activeView, setActiveView] = useState('search'); // 'search', 'createFood', or 'createRecipe'
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

  const renderActiveView = () => {
    switch (activeView) {
      case 'createFood':
        return <CreateFoodForm />;
      case 'createRecipe':
        return <CreateRecipeForm />;
      case 'search':
      default:
        return (
          <>
            <form onSubmit={handleSearch} style={styles.form}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all foods to add to your cookbook..."
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
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Food & Recipe Database</h2>
      
      <div style={styles.toggleContainer}>
        <button onClick={() => setActiveView('search')} style={activeView === 'search' ? styles.activeButton : styles.button}>Search & Add</button>
        <button onClick={() => setActiveView('createFood')} style={activeView === 'createFood' ? styles.activeButton : styles.button}>Create Food</button>
        <button onClick={() => setActiveView('createRecipe')} style={activeView === 'createRecipe' ? styles.activeButton : styles.button}>Create Recipe</button>
      </div>
      
      {renderActiveView()}
    </div>
  );
}

const styles = {
    container: { maxWidth: '800px', width: '100%', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' },
    toggleContainer: { display: 'flex', gap: '1rem', backgroundColor: '#1a1a1a', padding: '0.5rem', borderRadius: '8px' },
    button: { padding: '0.8rem 1.5rem', border: '1px solid transparent', borderRadius: '8px', backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '1rem' },
    activeButton: { padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontSize: '1rem' },
    form: { display: 'flex', gap: '10px', marginBottom: '1rem', width: '100%' },
    input: { flexGrow: 1, padding: '0.8rem', fontSize: '1rem' },
    list: { width: '100%', textAlign: 'left' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' },
    addButton: { backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' },
    removeButton: { backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' }
};

export default DatabasePage;