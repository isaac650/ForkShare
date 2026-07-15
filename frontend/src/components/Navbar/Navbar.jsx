import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ForkShare
      </Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Browse
        </Link>
        {user && (
          <>
            <Link to="/submit" className="navbar-link">
              Submit Recipe
            </Link>
            <Link to="/cookbook" className="navbar-link">
              My Cookbook
            </Link>
          </>
        )}
        {user ? (
          <>
            <span className="navbar-username">{user.name}</span>
            <button type="button" className="navbar-button" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Log In
            </Link>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
