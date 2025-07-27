import { useState } from 'react';
import apiClient from '../services/apiService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: '',
    gender: '',
    heightInches: '',
    weightPounds: '',
    activityLevel: 'sedentary',
    primaryGoal: 'weight maintenance'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clears previous errors

    try {
      await apiClient.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      // Might contain a more specific error message from the backend
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" required />
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
        <input type="number" name="heightInches" value={formData.heightInches} onChange={handleChange} placeholder="Height (inches)" required />
        <input type="number" name="weightPounds" value={formData.weightPounds} onChange={handleChange} placeholder="Weight (lbs)" required />

        <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
        </select>

        <select name="primaryGoal" value={formData.primaryGoal} onChange={handleChange}>
          <option value="weight loss">Weight Loss</option>
          <option value="weight maintenance">Weight Maintenance</option>
          <option value="muscle gain">Muscle Gain</option>
        </select>

        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegisterPage;