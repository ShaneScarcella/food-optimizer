import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FoodSearch from '../components/FoodSearch';

function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/profile">Edit Profile</Link>
      </nav>
      
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <FoodSearch />
    </div>
  );
}

export default DashboardPage;