import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: '80px', padding: '1rem' }}> 
        {children}
      </main>
    </div>
  );
}

export default Layout;
