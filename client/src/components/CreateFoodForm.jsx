import { useState } from 'react';
import apiClient from '../services/apiService';

const initialFormData = {
  name: '',
  brand: '',
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  servingSize: '',
  fiber: '',
  sugar: '',
  saturatedFat: '',
  sodium: '',
  potassium: '',
  calcium: '',
  iron: '',
  vitaminC: '',
  vitaminD: '',
};

function CreateFoodForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isPublic, setIsPublic] = useState(true);
  const [showMore, setShowMore] = useState(false); // State to toggle extra fields
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiClient.post('/foods', { food: formData, isPublic: isPublic });
      setMessage(`Successfully added ${formData.name}!`);
      setFormData(initialFormData); // Reset form to initial state
      setShowMore(false); // Hide extra fields after submission
    } catch (err) {
      setMessage('Failed to add food. Please check the values.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Create a New Food Item</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Core Inputs */}
        <div style={styles.inputGroup}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Food Name (e.g., Chicken Breast)" required style={styles.input}/>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand (e.g., Tyson)" style={styles.input}/>
        </div>
        <input type="text" name="servingSize" value={formData.servingSize} onChange={handleChange} placeholder="Serving Size (e.g., 100g)" required style={styles.input}/>
        
        <h4>Macronutrients (per serving)</h4>
        <div style={styles.inputGroup}>
          <input type="number" name="calories" value={formData.calories} onChange={handleChange} placeholder="Calories" required style={styles.input}/>
          <input type="number" name="protein" value={formData.protein} onChange={handleChange} placeholder="Protein (g)" required style={styles.input}/>
          <input type="number" name="carbs" value={formData.carbs} onChange={handleChange} placeholder="Carbs (g)" required style={styles.input}/>
          <input type="number" name="fat" value={formData.fat} onChange={handleChange} placeholder="Fat (g)" required style={styles.input}/>
        </div>

        {/* Toggle Button for Optional Fields */}
        <button type="button" onClick={() => setShowMore(!showMore)} style={styles.toggleButton}>
          {showMore ? 'Hide' : 'Show'} Optional Nutritional Info
        </button>

        {/* Optional Fields Container */}
        {showMore && (
          <div style={styles.optionalContainer}>
            <h4>Optional Macronutrients (g)</h4>
            <div style={styles.inputGroup}>
              <input type="number" name="fiber" value={formData.fiber} onChange={handleChange} placeholder="Fiber" style={styles.input}/>
              <input type="number" name="sugar" value={formData.sugar} onChange={handleChange} placeholder="Sugar" style={styles.input}/>
              <input type="number" name="saturatedFat" value={formData.saturatedFat} onChange={handleChange} placeholder="Saturated Fat" style={styles.input}/>
            </div>
            <h4>Minerals (mg)</h4>
            <div style={styles.inputGroup}>
              <input type="number" name="sodium" value={formData.sodium} onChange={handleChange} placeholder="Sodium" style={styles.input}/>
              <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} placeholder="Potassium" style={styles.input}/>
              <input type="number" name="calcium" value={formData.calcium} onChange={handleChange} placeholder="Calcium" style={styles.input}/>
              <input type="number" name="iron" value={formData.iron} onChange={handleChange} placeholder="Iron" style={styles.input}/>
            </div>
            <h4>Vitamins</h4>
            <div style={styles.inputGroup}>
                <input type="number" name="vitaminC" value={formData.vitaminC} onChange={handleChange} placeholder="Vitamin C (mg)" style={styles.input}/>
                <input type="number" name="vitaminD" value={formData.vitaminD} onChange={handleChange} placeholder="Vitamin D (IU)" style={styles.input}/>
            </div>
          </div>
        )}

        <div style={styles.checkboxContainer}>
          <label>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}/>
            Make this food available to all users?
          </label>
        </div>
        
        <button type="submit" style={styles.submitButton}>Add Food to Database</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
    container: { width: '100%', maxWidth: '800px' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    inputGroup: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
    input: { flex: 1, minWidth: '150px', padding: '0.8rem', fontSize: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '8px', color: 'white' },
    toggleButton: { alignSelf: 'flex-start', padding: '0.5rem 1rem', fontSize: '0.9rem' },
    optionalContainer: { display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #444', padding: '1rem', borderRadius: '8px' },
    checkboxContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' },
    submitButton: { padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }
};

export default CreateFoodForm;