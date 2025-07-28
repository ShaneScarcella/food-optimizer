import { useState, useEffect } from 'react';
import apiClient from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    heightInches: '',
    weightPounds: '',
    activityLevel: 'sedentary',
    primaryGoal: 'weight maintenance'
  });
  const [message, setMessage] = useState('');
  const { user } = useAuth(); // Assuming useAuth provides the user object or email

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setProfileData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setMessage("Could not load your profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await apiClient.put('/users/me', profileData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
      console.error("Update profile error:", error);
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Email: {profileData.email}</p>
      <form onSubmit={handleSubmit}>
        <label>Age: <input type="number" name="age" value={profileData.age} onChange={handleChange} /></label>
        <label>Gender: <input type="text" name="gender" value={profileData.gender} onChange={handleChange} /></label>
        <label>Height (in): <input type="number" name="heightInches" value={profileData.heightInches} onChange={handleChange} /></label>
        <label>Weight (lbs): <input type="number" name="weightPounds" value={profileData.weightPounds} onChange={handleChange} /></label>

        <label>Activity Level:
          <select name="activityLevel" value={profileData.activityLevel} onChange={handleChange}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>
        </label>

        <label>Primary Goal:
          <select name="primaryGoal" value={profileData.primaryGoal} onChange={handleChange}>
            <option value="weight loss">Weight Loss</option>
            <option value="weight maintenance">Weight Maintenance</option>
            <option value="muscle gain">Muscle Gain</option>
          </select>
        </label>

        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProfilePage;