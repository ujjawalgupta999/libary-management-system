import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', availableCopies: 1, pdfUrl: '', loanPeriodDays: 14 // 🟢 Added state
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/books/add', formData);
      setMessage(res.data.message || 'Book added successfully!');
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) { setMessage(err.response?.data?.message || 'Error adding book'); }
  };

  return (
    <div className="form-container">
      <h2>Add New Book</h2>
      {message && <div className={message.includes('Error') ? "alert alert-error" : "alert alert-success"}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} required />
          <input type="text" name="author" placeholder="Author Name" value={formData.author} onChange={handleChange} required />
          <input type="text" name="isbn" placeholder="ISBN (Optional)" value={formData.isbn} onChange={handleChange} />
          <input type="number" name="availableCopies" placeholder="Number of Copies" value={formData.availableCopies} onChange={handleChange} min="1" required />
          <input type="number" name="loanPeriodDays" placeholder="Loan Period (Days)" value={formData.loanPeriodDays} onChange={handleChange} min="1" required />
          <input type="url" name="pdfUrl" placeholder="Online PDF URL (Optional)" value={formData.pdfUrl} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Book</button>
      </form>
    </div>
  );
}