import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FoodSearch from '../components/FoodSearch';
import CreateFoodForm from '../components/CreateFoodForm';
import apiClient from '../services/apiService';
import DailyLog from '../components/DailyLog';

function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

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

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard - Welcome, {userProfile.email}!</h1>
      <nav>
        <Link to="/profile">Edit Profile</Link>
      </nav>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <DailyLog />
      <FoodSearch />
      <CreateFoodForm />
    </div>
  );
}

export default DashboardPage;