import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', formData);
      const response = await api.post('/api/auth/login', formData);
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Force page reload to update auth state
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={{ background: '#fee', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{ width: '100%' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}