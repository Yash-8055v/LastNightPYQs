import { useState } from 'react';
import { authAPI } from '../utils/api';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      
      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Call the onLoginSuccess callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          // Fallback: redirect to admin dashboard
          window.location.href = '/admin';
        }
      }
    } catch (err) {
      if (err.isConnectionError) {
        setError('Backend server is not running. Please start the backend server on port 3000.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed p-2 rounded text-white"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
