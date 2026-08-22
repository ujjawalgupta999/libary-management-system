import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import LibrarianDashboard from './components/LibrarianDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './components/StudentDashboard';
import './index.css';

function App() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const canManageBooks = user && (user.role === 'librarian' || user.role === 'admin');
  const isAdmin = user && user.role === 'admin';

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">Catalog</Link>
        
<div className="nav-right">
          {token ? (
            <>
              {isAdmin && <Link to="/admin">Manage Users</Link>}
              {canManageBooks && (
                <>
                  <Link to="/approvals">Approvals</Link>
                  <Link to="/add-book">Add New Book</Link>
                </>
              )}
              {/* Add this line for students! */}
              {(user?.role === 'student' || user?.role === 'admin') && <Link to="/my-books">My Books</Link>}
              
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {user?.name} ({user?.role})
              </span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<BookList />} />
          
          <Route 
            path="/add-book" 
            element={
              <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                <AddBook />
              </ProtectedRoute>
            } 
          />
          <Route 
  path="/my-books" 
  element={
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>
          
          <Route 
            path="/approvals" 
            element={
              <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                <LibrarianDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;