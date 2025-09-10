import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ children }) {
  const layoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#242424',
    color: 'rgba(255, 255, 255, 0.87)',
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={mainStyle}>
        {children || <Outlet />}
      </main>
    </div>
  );
}

export default Layout;