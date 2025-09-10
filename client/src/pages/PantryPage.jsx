import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';

function PantryPage() {
  const [pantryItems, setPantryItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPantry = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setPantryItems(response.data.pantryItems || []);
      } catch (error) {
        console.error("Failed to fetch pantry", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPantry();
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() && !pantryItems.find(item => item.toLowerCase() === newItem.trim().toLowerCase())) {
      setPantryItems([...pantryItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    setPantryItems(pantryItems.filter(item => item !== itemToRemove));
  };

  const handleSaveChanges = async () => {
    setMessage('');
    try {
      await apiClient.put('/pantry', pantryItems);
      setMessage('Pantry saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error)
      {
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
        <p style={styles.subtitle}>Add items you typically have on hand, like spices, oils, or bulk grains. This helps the meal planner suggest recipes you can easily make.</p>
        <form onSubmit={handleAddItem} style={styles.form}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add an item (e.g., Olive Oil)"
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>Add</button>
        </form>

        <ul style={styles.list}>
          {pantryItems.length > 0 ? (
            pantryItems.map((item, index) => (
              <li key={index} style={styles.listItem}>
                <span>{item}</span>
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

// Styles focused on alignment and dark theme
const styles = {
  container: {
    maxWidth: '800px',
    width: '100%',
    padding: '2rem',
    textAlign: 'center',
  },
  header: {
    marginBottom: '1rem',
  },
  subtitle: {
    color: '#aaa',
    marginTop: '0',
    marginBottom: '2rem',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '2rem',
  },
  input: {
    flexGrow: 1,
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #555',
    borderRadius: '8px',
    color: 'white',
  },
  addButton: {
    padding: '0.8rem 1.5rem',
    border: '1px solid transparent',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem',
    textAlign: 'left',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  removeButton: {
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  saveButton: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: '1px solid transparent',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
  },
  emptyMessage: {
      color: '#888',
      marginTop: '2rem',
  },
  successMessage: {
    color: '#28a745',
    marginTop: '1rem',
  },
  errorMessage: {
    color: '#dc3545',
    marginTop: '1rem',
  }
};


export default PantryPage;