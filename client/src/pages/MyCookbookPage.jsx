import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function MyCookbookPage() {
  const { token } = useAuth();
  const [myFoods, setMyFoods] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch both foods and their metadata
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const foodsResponse = await apiClient.get('/foods/my-foods');
          const metadataResponse = await apiClient.get('/metadata');
          
          setMyFoods(foodsResponse.data);

          // Convert metadata to a map: { foodId: metadataObject }
          const metadataMap = metadataResponse.data.reduce((acc, meta) => {
            acc[meta.foodId] = meta;
            return acc;
          }, {});
          setMetadata(metadataMap);

        } catch (error) {
          console.error("Failed to fetch cookbook data", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  // Handle changes to the personal info fields
  const handleMetadataChange = (foodId, field, value) => {
    setMetadata(prev => ({
      ...prev,
      [foodId]: {
        ...prev[foodId],
        foodId: foodId, // Ensure foodId is set
        [field]: value
      }
    }));
  };

  // Save the updated metadata for a single food item
  const handleSaveMetadata = async (foodId) => {
    const foodMetadata = metadata[foodId];
    if (!foodMetadata) return;

    // Ensure price is a number
    const payload = {
        ...foodMetadata,
        lastPrice: parseFloat(foodMetadata.lastPrice) || 0
    };

    try {
      const response = await apiClient.post('/metadata', payload);
      // Update the state with the saved data, which might include a new ID from the DB
      setMetadata(prev => ({ ...prev, [foodId]: response.data }));
      setMessage('Details saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error("Failed to save metadata", error);
    }
  };

  if (isLoading) {
    return <p>Loading your cookbook...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>My Cookbook</h2>
      <p>Manage your personal collection of foods and their shopping details.</p>
      {message && <p style={{ color: '#28a745' }}>{message}</p>}

      <div style={styles.list}>
        {myFoods.length > 0 ? myFoods.map(food => {
          const foodMeta = metadata[food.id] || {};
          return (
            <div key={food.id} style={styles.foodItem}>
              <div style={styles.foodInfo}>
                <h4 style={{ margin: 0 }}>{food.name}</h4>
                <p style={{ margin: '5px 0', color: '#aaa' }}>{food.brand || 'No brand'} - {food.calories} kcal per {food.servingSize}</p>
              </div>
              <div style={styles.metadataForm}>
                <input 
                  type="text" 
                  placeholder="Preferred Store" 
                  value={foodMeta.preferredStore || ''}
                  onChange={(e) => handleMetadataChange(food.id, 'preferredStore', e.target.value)}
                  style={styles.input}
                />
                <input 
                  type="number" 
                  placeholder="Last Price" 
                  value={foodMeta.lastPrice || ''}
                  onChange={(e) => handleMetadataChange(food.id, 'lastPrice', e.target.value)}
                  style={styles.input}
                />
                <button onClick={() => handleSaveMetadata(food.id)} style={styles.button}>Save</button>
              </div>
            </div>
          )
        }) : (
          <p>Your cookbook is empty. Add foods from the "Database" page to get started.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
    container: { maxWidth: '900px', width: '100%', padding: '2rem', textAlign: 'center' },
    list: { width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' },
    foodItem: { backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    foodInfo: { flex: 1, minWidth: '200px' },
    metadataForm: { display: 'flex', gap: '10px', alignItems: 'center' },
    input: { padding: '0.5rem', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' },
    button: { padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', backgroundColor: '#555', color: 'white', cursor: 'pointer' }
};

export default MyCookbookPage;