import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-group">
        <input 
          type="text" 
          placeholder="Full Name" 
          required 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          required 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />
        
        <label style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Select Role:</label>
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
        >
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
          <option value="admin">College Administration</option>
        </select>

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login here</Link>
      </p>
    </div>
  );
}