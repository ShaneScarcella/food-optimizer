import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div style={navLeft}>
        <Link to="/" style={brandStyle}>Food Optimizer</Link>
      </div>
      <div style={navCenter}>
        {token && (
        <>
            <Link to="/log-food" style={linkStyle}>Log Food</Link>
            <Link to="/my-cookbook" style={linkStyle}>My Cookbook</Link>
            <Link to="/database" style={linkStyle}>Database</Link>
            <Link to="/meal-plan" style={linkStyle}>Meal Plan</Link>
            <Link to="/pantry" style={linkStyle}>Pantry</Link>
            <Link to="/analytics" style={linkStyle}>Analytics</Link>
        </>
        )}
      </div>
      <div style={navRight}>
        {token ? (
          <>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={buttonStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#333',
  color: 'white',
  width: '100%',
  boxSizing: 'border-box',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
};

const navLeft = {
  flex: 1,
  textAlign: 'left',
};

const navCenter = {
    flex: 2,
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
};

const navRight = {
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '1rem',
};

const brandStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1rem',
  padding: '0.5rem 1rem',
};

const buttonStyle = {
  ...linkStyle,
  backgroundColor: '#555',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};


export default Navbar;