import { useState } from 'react';
import apiClient from '../services/apiService';

function CreateFoodForm() {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: ''
  });
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
      await apiClient.post('/foods', formData);
      setMessage(`Successfully added ${formData.name}!`);
      // Clears form after submission
      setFormData({
        name: '', calories: '', protein: '', carbs: '', fat: '', servingSize: ''
      });
    } catch (err) {
      setMessage('Failed to add food. Please check the values.');
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Add a New Food</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Food Name" required />
        <input type="number" name="calories" value={formData.calories} onChange={handleChange} placeholder="Calories" required />
        <input type="number" name="protein" value={formData.protein} onChange={handleChange} placeholder="Protein (g)" required />
        <input type="number" name="carbs" value={formData.carbs} onChange={handleChange} placeholder="Carbs (g)" required />
        <input type="number" name="fat" value={formData.fat} onChange={handleChange} placeholder="Fat (g)" required />
        <input type="text" name="servingSize" value={formData.servingSize} onChange={handleChange} placeholder="Serving Size (e.g., 100g)" />
        <button type="submit">Add Food</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateFoodForm;