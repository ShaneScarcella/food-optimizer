import { useState, useEffect } from 'react';
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
      <hr />
      <h2>Your Progress at a Glance</h2>
      <p>This is your main dashboard. Future widgets with analytics and summaries will go here.</p>
      <p>Your current primary goal is: <strong>{userProfile.primaryGoal}</strong>.</p>
    </div>
  );
}

export default DashboardPage;