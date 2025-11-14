import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, LogOut } from 'lucide-react';
import { authAPI } from '../utils/api';

function Navbar({ currentPage, setCurrentPage, setShowAdminModal, onLogout }) {
  const [showModal, setShowModal] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setCurrentPage('admin');
    } else {
      setShowModal(true);
      setError('');
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setShowModal(false);
        setCurrentPage('admin');
        setCredentials({ username: '', password: '' });
        // Trigger page reload to sync authentication state across components
        window.location.reload();
      }
    } catch (err) {
      if (err.isConnectionError) {
        setError('Backend server is not running. Please start the backend server on port 3000.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentPage('home');
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage('home')}
              className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer"
            >
              LastNight PYQs
            </motion.h1>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('home')}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  currentPage === 'home'
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-800/50 border-gray-700 text-gray-200 hover:border-purple-500'
                }`}
              >
                Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage('about')}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  currentPage === 'about'
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-gray-800/50 border-gray-700 text-gray-200 hover:border-purple-500'
                }`}
              >
                About
              </motion.button>
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage('admin')}
                    className={`px-6 py-2 rounded-lg border transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-800/50 border-gray-700 text-gray-200 hover:border-purple-500'
                    }`}
                  >
                    Admin
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdminClick}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                >
                  Admin
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 w-96 relative"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <LogIn className="text-purple-500" size={32} />
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;