import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function PantryPage() {
  const { token } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch full Food objects for the pantry
  useEffect(() => {
    if (token) {
      const fetchPantry = async () => {
        try {
          const response = await apiClient.get('/foods/pantry');
          setPantryItems(response.data || []);
        } catch (error) {
          console.error("Failed to fetch pantry", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPantry();
    }
  }, [token]);

  // Search for new foods to add
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await apiClient.get(`/foods/search?name=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to search for food", error);
    }
  };

  const handleAddItem = (foodToAdd) => {
    if (!pantryItems.some(item => item.id === foodToAdd.id)) {
      setPantryItems([...pantryItems, foodToAdd]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveItem = (itemToRemove) => {
    setPantryItems(pantryItems.filter(item => item.id !== itemToRemove.id));
  };

  // Save the list of Food IDs to the backend
  const handleSaveChanges = async () => {
    setMessage('');
    try {
      // Extract just the IDs from our list of Food objects
      const pantryItemIds = pantryItems.map(item => item.id);
      await apiClient.put('/pantry', pantryItemIds);
      setMessage('Pantry saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save pantry.');
      console.error("Failed to save pantry", error);
    }
  };

  if (isLoading) {
    return <p>Loading pantry...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Your Digital Pantry</h2>
      <p style={styles.subtitle}>Search for and add food items you typically have on hand. This helps the meal planner suggest recipes you can easily make.</p>
      
      {/* Search form to find new items */}
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a food to add..."
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Search</button>
      </form>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <ul style={styles.list}>
          {searchResults.map((food) => (
            <li key={food.id} style={styles.searchItem}>
              <span>{food.name}</span>
              <button onClick={() => handleAddItem(food)} style={styles.addButton}>Add</button>
            </li>
          ))}
        </ul>
      )}

      {/* Display current pantry items */}
      <ul style={styles.list}>
        {pantryItems.length > 0 ? (
          pantryItems.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <span>{item.name}</span>
              <button onClick={() => handleRemoveItem(item)} style={styles.removeButton}>Remove</button>
            </li>
          ))
        ) : (
          <p style={styles.emptyMessage}>Your pantry is empty.</p>
        )}
      </ul>

      <button onClick={handleSaveChanges} style={styles.saveButton}>Save Pantry Changes</button>
      {message && <p style={message.includes('successfully') ? styles.successMessage : styles.errorMessage}>{message}</p>}
    </div>
  );
}

const styles = {
    container: { maxWidth: '800px', width: '100%', padding: '2rem', textAlign: 'center' },
    header: { marginBottom: '1rem' },
    subtitle: { color: '#aaa', marginTop: '0', marginBottom: '2rem', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' },
    form: { display: 'flex', gap: '10px', marginBottom: '1rem' },
    input: { flexGrow: 1, padding: '0.8rem', fontSize: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '8px', color: 'white' },
    addButton: { padding: '0.8rem 1.5rem', border: '1px solid #555', borderRadius: '8px', backgroundColor: '#1a1a1a', cursor: 'pointer', transition: 'border-color 0.25s' },
    list: { listStyle: 'none', padding: 0, marginBottom: '2rem', textAlign: 'left' },
    searchItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#333', borderRadius: '8px', marginBottom: '10px' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' },
    removeButton: { backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px', padding: '0.5rem 1rem', cursor: 'pointer' },
    saveButton: { width: '100%', padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid transparent', borderRadius: '8px', backgroundColor: '#1a1a1a', cursor: 'pointer', transition: 'border-color 0.25s' },
    emptyMessage: { color: '#888', marginTop: '2rem' },
    successMessage: { color: '#28a745', marginTop: '1rem' },
    errorMessage: { color: '#dc3545', marginTop: '1rem' }
};

export default PantryPage;