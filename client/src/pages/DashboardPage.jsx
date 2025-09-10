import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiService';

function DashboardPage() {
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

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard - Welcome, {userProfile.firstName}!</h1>
      <p>This is your dashboard where you can get a quick overview of your nutrition and activities.</p>
    </div>
  );
}

export default DashboardPage;