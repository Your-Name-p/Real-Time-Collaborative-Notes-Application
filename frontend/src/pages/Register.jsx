import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'editor' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting registration with:', formData);
      const response = await api.post('/api/auth/register', formData);
      console.log('Registration response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Force page reload to update auth state
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Account</h2>
            <p className="text-gray-600">Join our collaborative workspace</p>
          </div>

          {error && (
            <div style={{ background: '#fee', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="label">Role</label>
              <select
                className="input"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{ width: '100%' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
              Already have an account? Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}