import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Protect admin route - redirect to login if not authenticated
  useEffect(() => {
    if (currentPage === 'admin' && !isAuthenticated) {
      setCurrentPage('login');
    }
  }, [currentPage, isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {currentPage !== 'login' && (
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          setShowAdminModal={setShowAdminModal}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'home' && <Home />}
      {currentPage === 'about' && <About />}
      {currentPage === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'admin' && isAuthenticated && <AdminDashboard />}
      
      {currentPage !== 'login' && <Footer />}
    </div>
  );
}

export default App;