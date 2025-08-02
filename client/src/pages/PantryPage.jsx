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
    if (newItem && !pantryItems.includes(newItem)) {
      setPantryItems([...pantryItems, newItem]);
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
    } catch (error) {
      setMessage('Failed to save pantry.');
      console.error("Failed to save pantry", error);
    }
  };

  if (isLoading) {
    return <p>Loading pantry...</p>;
  }

  return (
    <div>
      <h2>Your Digital Pantry</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add an item (e.g., Olive Oil)"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {pantryItems.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleRemoveItem(item)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSaveChanges}>Save Pantry Changes</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PantryPage;