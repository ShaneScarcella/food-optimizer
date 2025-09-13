import { useState } from 'react';
import apiClient from '../services/apiService';

function CreateRecipeForm() {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    instructions: '',
    servings: 1,
  });
  const [ingredients, setIngredients] = useState([]);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleRecipeChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodSearch = async () => {
    if (!foodSearchTerm.trim()) return;
    try {
      const response = await apiClient.get(`/foods/search?name=${foodSearchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search for food:', error);
    }
  };

  const addIngredient = (food) => {
    // Prevent adding the same ingredient twice
    if (ingredients.some(ing => ing.foodId === food.id)) return;
    
    setIngredients(prev => [...prev, { foodId: food.id, name: food.name, quantity: 1, unit: 'serving' }]);
    setFoodSearchTerm('');
    setSearchResults([]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const recipePayload = {
      ...recipe,
      // Only need to send the backend what it expects for an Ingredient
      ingredients: ingredients.map(({ foodId, quantity, unit }) => ({ foodId, quantity: parseFloat(quantity), unit })),
    };

    try {
      await apiClient.post('/recipes', recipePayload);
      setMessage(`Recipe "${recipe.name}" created successfully!`);
      setRecipe({ name: '', description: '', instructions: '', servings: 1 });
      setIngredients([]);
    } catch (error) {
      setMessage('Failed to create recipe. Please check all fields.');
      console.error('Create recipe error:', error);
    }
  };


  return (
    <div style={styles.formContainer}>
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Recipe Details */}
        <input type="text" name="name" value={recipe.name} onChange={handleRecipeChange} placeholder="Recipe Name" required style={styles.input} />
        <textarea name="description" value={recipe.description} onChange={handleRecipeChange} placeholder="Description" style={styles.textarea}></textarea>
        <textarea name="instructions" value={recipe.instructions} onChange={handleRecipeChange} placeholder="Cooking Instructions" style={styles.textarea}></textarea>
        <input type="number" name="servings" value={recipe.servings} onChange={handleRecipeChange} placeholder="Servings" min="1" required style={styles.input} />

        {/* Ingredient Search */}
        <div style={styles.searchContainer}>
          <input type="text" value={foodSearchTerm} onChange={(e) => setFoodSearchTerm(e.target.value)} placeholder="Search for ingredients..." style={{...styles.input, flexGrow: 1}}/>
          <button type="button" onClick={handleFoodSearch} style={styles.button}>Search</button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <ul style={styles.searchResultsList}>
            {searchResults.map(food => (
              <li key={food.id} onClick={() => addIngredient(food)} style={styles.searchResultItem}>
                {food.name}
              </li>
            ))}
          </ul>
        )}

        {/* Added Ingredients List */}
        <h3>Ingredients</h3>
        <div style={styles.ingredientsList}>
          {ingredients.length > 0 ? ingredients.map((ing, index) => (
            <div key={index} style={styles.ingredientRow}>
              <span style={{ flex: 3 }}>{ing.name}</span>
              <input type="number" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} min="0.1" step="0.1" style={{...styles.input, flex: 1}}/>
              <input type="text" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} style={{...styles.input, flex: 1}}/>
              <button type="button" onClick={() => removeIngredient(index)} style={styles.removeButton}>&times;</button>
            </div>
          )) : <p>No ingredients added yet.</p>}
        </div>

        <button type="submit" style={styles.submitButton}>Save Recipe</button>
        {message && <p style={message.includes('successfully') ? styles.successMessage : styles.errorMessage}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
    formContainer: { width: '100%', maxWidth: '800px', backgroundColor: '#2a2a2a', padding: '2rem', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.8rem', fontSize: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '8px', color: 'white' },
    textarea: { minHeight: '100px', padding: '0.8rem', fontSize: '1rem', backgroundColor: '#1a1a1a', border: '1px solid #555', borderRadius: '8px', color: 'white', fontFamily: 'inherit' },
    searchContainer: { display: 'flex', gap: '10px' },
    button: { padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#555', color: 'white', cursor: 'pointer' },
    searchResultsList: { listStyle: 'none', padding: 0, margin: 0, border: '1px solid #555', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto' },
    searchResultItem: { padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid #555' },
    ingredientsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    ingredientRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    removeButton: { backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' },
    submitButton: { padding: '1rem', fontSize: '1.2rem', fontWeight: 'bold', border: '1px solid transparent', borderRadius: '8px', backgroundColor: '#1a1a1a', cursor: 'pointer', transition: 'border-color 0.25s' },
    successMessage: { color: '#28a745', marginTop: '1rem' },
    errorMessage: { color: '#dc3545', marginTop: '1rem' }
};

export default CreateRecipeForm;