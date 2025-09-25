import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';

// This is the form that will pop up when the user clicks "Edit"
function EditFoodModal({ food, metadata, onSave, onClose, userId }) {
  const [foodData, setFoodData] = useState(food);
  const [metadataData, setMetadataData] = useState(metadata);
  const [isSaving, setIsSaving] = useState(false);

  // When the food prop changes, update the internal state
  useEffect(() => {
    setFoodData(food);
    setMetadataData(metadata);
  }, [food, metadata]);

  const handleChange = (e, target) => {
    const { name, value } = e.target;
    if (target === 'food') {
      setFoodData(prev => ({ ...prev, [name]: value }));
    } else {
      setMetadataData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save the core food data. This triggers the copy-on-edit logic on the backend.
      const updatedFoodResponse = await apiClient.put(`/foods/${food.id}`, foodData);
      const savedFood = updatedFoodResponse.data;

      // Save the personal metadata, making sure it's linked to the correct food ID
      const metadataPayload = {
        ...metadataData,
        foodId: savedFood.id, // Use the ID from the (potentially new) saved food
        userId: userId,
        lastPrice: parseFloat(metadataData.lastPrice) || 0
      };
      const updatedMetadataResponse = await apiClient.post('/metadata', metadataPayload);
      
      // Pass both updated objects back to the parent page to update the UI instantly
      onSave(savedFood, updatedMetadataResponse.data);
      onClose();

    } catch (error) {
      console.error("Failed to save changes", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h3>Edit: {foodData.name}</h3>
        {/* Core Food Details */}
        <input type="text" name="name" value={foodData.name} onChange={(e) => handleChange(e, 'food')} placeholder="Food Name" style={styles.input} />
        <input type="text" name="brand" value={foodData.brand || ''} onChange={(e) => handleChange(e, 'food')} placeholder="Brand" style={styles.input} />
        <input type="number" name="calories" value={foodData.calories} onChange={(e) => handleChange(e, 'food')} placeholder="Calories" style={styles.input} />
        {/* Add other core food fields here as needed */}
        
        {/* Personal Metadata */}
        <h4>Your Personal Details</h4>
        <input type="text" name="preferredStore" value={metadataData.preferredStore || ''} onChange={(e) => handleChange(e, 'metadata')} placeholder="Preferred Store" style={styles.input} />
        <input type="number" name="lastPrice" value={metadataData.lastPrice || ''} onChange={(e) => handleChange(e, 'metadata')} placeholder="Last Price" style={styles.input} />
        
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.button}>Cancel</button>
          <button onClick={handleSave} disabled={isSaving} style={styles.saveButton}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1001 },
    modalContent: { backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.8rem', fontSize: '1rem', border: '1px solid #555', borderRadius: '8px', color: 'white', backgroundColor: '#1a1a1a' },
    buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
    button: { padding: '0.8rem 1.5rem', border: '1px solid #555' },
    saveButton: { padding: '0.8rem 1.5rem', border: 'none', backgroundColor: '#28a745', color: 'white' }
};


export default EditFoodModal;