import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LibrarianDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => { 
    fetchRequests(); 
    fetchActiveLoans();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/loans/pending');
      setRequests(res.data);
    } catch (err) { console.error('Error fetching requests', err); }
  };

  const fetchActiveLoans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/loans/active');
      setActiveLoans(res.data);
    } catch (err) { console.error('Error fetching active loans', err); }
  };

  const handleApprove = async (id, action) => {
    try {
      const res = await axios.post('http://localhost:5000/api/loans/approve', { loanId: id, action });
      setMessage(res.data.message);
      fetchRequests();
      fetchActiveLoans();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing request');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleReturn = async (id) => {
    try {
      const res = await axios.post('http://localhost:5000/api/loans/process-return', { loanId: id });
      setMessage(res.data.message);
      fetchActiveLoans();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error returning book');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      {message && <div className={message.includes('Error') ? "alert alert-error" : "alert alert-success"} style={{ padding: '10px', marginBottom: '15px' }}>{message}</div>}

      <h2>Pending Approvals</h2>
      <div className="book-grid" style={{ marginBottom: '40px' }}>
        {requests.map(req => (
          <div key={req._id} className="book-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <h3>{req.bookId?.title}</h3>
            <p><strong>Student:</strong> {req.userId?.name} ({req.userId?.email})</p>
            <div className="card-actions">
              <button className="btn btn-success" onClick={() => handleApprove(req._id, 'approve')}>Approve</button>
              <button className="btn btn-danger" onClick={() => handleApprove(req._id, 'reject')}>Reject</button>
            </div>
          </div>
        ))}
        {requests.length === 0 && <p>No pending borrow requests.</p>}
      </div>

      <hr style={{ margin: '30px 0' }} />

      <h2>Active Loans (Process Returns)</h2>
      <div className="book-grid">
        {activeLoans.map(loan => (
          <div key={loan._id} className="book-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <h3>{loan.bookId?.title}</h3>
            <p><strong>Student:</strong> {loan.userId?.name}</p>
            <p><strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
            {new Date(loan.dueDate) < new Date() && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ OVERDUE</p>}
            <div className="card-actions" style={{ marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={() => handleReturn(loan._id)} style={{ width: '100%' }}>Process Return</button>
            </div>
          </div>
        ))}
        {activeLoans.length === 0 && <p>No active loans currently checked out.</p>}
      </div>
    </div>
  );
}