import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        setShowAdminModal={setShowAdminModal}
      />

      {currentPage === 'home' && <Home />}
      {currentPage === 'about' && <About />}
      {currentPage === 'admin' && <AdminDashboard />}
      
      <Footer />
    </div>
  );
}

export default App;