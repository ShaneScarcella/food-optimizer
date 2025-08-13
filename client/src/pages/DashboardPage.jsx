import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FoodSearch from '../components/FoodSearch';
import CreateFoodForm from '../components/CreateFoodForm';
import DailyLog from '../components/DailyLog';
import apiClient from '../services/apiService';

function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [logRefreshKey, setLogRefreshKey] = useState(0); // Key to force re-render of DailyLog

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFoodLogged = () => {
    setLogRefreshKey(prevKey => prevKey + 1);
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard - Welcome, {userProfile.email}!</h1>
      <nav>
        <Link to="/profile">Edit Profile</Link> | <Link to="/pantry">My Pantry</Link> | <Link to="/meal-plan">Meal Plan</Link> |
        <Link to="/analytics">Analytics</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <DailyLog key={logRefreshKey} />
      <FoodSearch onFoodLogged={handleFoodLogged} />
      <CreateFoodForm />
    </div>
  );
}

export default DashboardPage;