import { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/create', formData);
      setMessage(res.data.message);
      setFormData({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      // Pop up an alert with the exact error from the backend
      const exactError = err.response?.data?.message || err.message;
      alert("Error Details: " + exactError);
      setMessage(exactError);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New User</h2>
      {message && <div className={message.includes('Error') ? "alert alert-error" : "alert alert-success"}>{message}</div>}
      <form onSubmit={handleSubmit} className="form-group">
        <input type="text" placeholder="Full Name" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email" value={formData.email} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
        <input type="password" placeholder="Temporary Password" value={formData.password} required onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ padding: '10px' }}>
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
        </select>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  );
}