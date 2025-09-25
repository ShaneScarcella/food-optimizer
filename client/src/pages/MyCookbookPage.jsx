import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import EditFoodModal from '../components/EditFoodModal';

function MyCookbookPage() {
  const { token, user } = useAuth();
  const [myFoods, setMyFoods] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);

  // Fetch both foods and their metadata
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [foodsResponse, metadataResponse] = await Promise.all([
            apiClient.get('/foods/my-foods'),
            apiClient.get('/metadata')
          ]);
          
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

  const handleOpenEditModal = (food) => {
    setSelectedFood(food);
  };

  const handleCloseEditModal = () => {
    setSelectedFood(null);
  };

  const handleSave = (updatedFood, updatedMetadata) => {
    // Update the food list in the UI
    setMyFoods(prevFoods => {
      // If a new food was created (copy-on-edit), the ID will have changed
      const index = prevFoods.findIndex(f => f.id === selectedFood.id);
      if (index !== -1) {
          const newFoods = [...prevFoods];
          newFoods[index] = updatedFood;
          return newFoods;
      }
      return prevFoods;
    });

    // Update the metadata map
    setMetadata(prevMeta => ({
        ...prevMeta,
        [updatedFood.id]: updatedMetadata
    }));
  };
  
  const handleRemove = async (foodToRemove) => {
      if (window.confirm(`Are you sure you want to remove "${foodToRemove.name}" from your cookbook?`)) {
        try {
            await apiClient.delete(`/users/me/my-foods/${foodToRemove.id}`);
            setMyFoods(prev => prev.filter(food => food.id !== foodToRemove.id));
        } catch (error) {
            console.error("Failed to remove food", error);
        }
      }
  };


  if (isLoading) {
    return <p>Loading your cookbook...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>My Cookbook</h2>
      <p>Manage your personal collection of foods and recipes. Edit details or remove items you no longer use.</p>
      
      <div style={styles.list}>
        {myFoods.length > 0 ? myFoods.map(food => {
          const isPersonal = food.createdByUserId === user?.id; // Check if the food is a personal copy
          return (
            <div key={food.id} style={styles.foodItem}>
              <div>
                <h4 style={{ margin: 0 }}>{food.name} {isPersonal && <span style={styles.tag}>(Personal)</span>}</h4>
                <p style={{ margin: '5px 0', color: '#aaa' }}>{food.brand || 'No brand'} - {food.calories} kcal</p>
              </div>
              <div style={styles.buttonContainer}>
                <button onClick={() => handleOpenEditModal(food)} style={styles.button}>Edit</button>
                <button onClick={() => handleRemove(food)} style={styles.removeButton}>Remove</button>
              </div>
            </div>
          )
        }) : (
          <p>Your cookbook is empty. Add foods from the "Database" page to get started.</p>
        )}
      </div>

      {selectedFood && (
        <EditFoodModal 
          food={selectedFood}
          metadata={metadata[selectedFood.id] || {}}
          onSave={handleSave}
          onClose={handleCloseEditModal}
          userId={user?.id}
        />
      )}
    </div>
  );
}

const styles = {
    container: { maxWidth: '900px', width: '100%', padding: '2rem', textAlign: 'center' },
    list: { width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' },
    foodItem: { backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    tag: { fontSize: '0.8rem', backgroundColor: '#555', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px' },
    buttonContainer: { display: 'flex', gap: '10px' },
    button: { padding: '0.5rem 1rem', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', cursor: 'pointer' },
    removeButton: { padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', backgroundColor: '#c0392b', color: 'white', cursor: 'pointer' }
};


export default MyCookbookPage;