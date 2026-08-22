import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isStudentOrAdmin = user && (user.role === 'student' || user.role === 'admin');
  const isLibrarianOrAdmin = user && (user.role === 'librarian' || user.role === 'admin');

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:5000/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  };

  const handleBorrow = async (bookId) => {
    if (!user) return setMessage('You must be logged in.');
    try {
      const res = await axios.post('http://localhost:5000/api/loans/request-borrow', { bookId });
      setMessage(res.data.message);
      fetchBooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing request');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        setBooks(books.filter(b => b._id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Library Catalog</h2>
        <input type="text" placeholder="Search by title or author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 15px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }} />
      </div>
      
      {message && <div className={message.includes('Error') ? "alert alert-error" : "alert alert-success"}>{message}</div>}

      <div className="book-grid">
        {filteredBooks.map(book => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies}</p>
            <p><strong>Loan Period:</strong> {book.loanPeriodDays || 14} Days</p>
            
            {book.pdfUrl && (
              <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* 🟢 NEW: Direct URL Link for Desktop Users */}
                <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                  Read Online Now
                </a>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'gray' }}>Or scan for mobile:</p>
                  <QRCodeSVG value={book.pdfUrl} size={60} />
                </div>
              </div>
            )}
            
            <div className="card-actions" style={{ marginTop: '15px' }}>
              {isStudentOrAdmin && <button className="btn btn-success" onClick={() => handleBorrow(book._id)} disabled={book.availableCopies <= 0}>Request Borrow</button>}
              {isLibrarianOrAdmin && <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}