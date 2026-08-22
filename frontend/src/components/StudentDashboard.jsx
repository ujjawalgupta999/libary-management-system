import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
  const [myLoans, setMyLoans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/loans/my-loans');
      setMyLoans(res.data);
    } catch (err) {
      setError('Failed to fetch your library history.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Library Dashboard</h2>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="book-grid">
        {myLoans.map(loan => {
          const isOverdue = loan.status === 'borrowed' && new Date(loan.dueDate) < new Date();
          
          return (
            <div key={loan._id} className="book-card" style={{ borderLeft: `4px solid ${isOverdue ? 'red' : 'var(--primary-color)'}`}}>
              <h3>{loan.bookId?.title}</h3>
              <p><strong>Author:</strong> {loan.bookId?.author}</p>
              
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '5px' }}>
                <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{loan.status.replace('_', ' ')}</span></p>
                
                {loan.status === 'borrowed' && (
                  <>
                    <p><strong>Borrowed On:</strong> {new Date(loan.issueDate).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}</p>
                    {isOverdue && (
                      <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
                        ⚠️ OVERDUE - Account Frozen until returned.
                      </p>
                    )}
                  </>
                )}
                
                {loan.status === 'pending_borrow' && (
                  <p style={{ color: '#f59e0b', fontSize: '0.9em', marginTop: '5px' }}>
                    Waiting for librarian approval...
                  </p>
                )}
              </div>
            </div>
          );
        })}
        
        {myLoans.length === 0 && <p>You have no current or past book requests.</p>}
      </div>
    </div>
  );
}