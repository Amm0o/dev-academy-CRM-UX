import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartIcon from '../Cart/CartIcon';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-text">CRM Store</span>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/products" 
                className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              
              <Link 
                to="/orders" 
                className={`navbar-link ${isActive('/orders') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Orders
              </Link>

              {user?.role === 'Admin' && (
                <Link 
                  to="/admin" 
                  className={`navbar-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Admin
                </Link>
              )}

              <div className="navbar-right">
                <div onClick={closeMobileMenu}>
                  <CartIcon />
                </div>
                
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{user?.role}</span>
                </div>

                <button 
                  className="logout-button" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-right">
              <Link 
                to="/login" 
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="navbar-link register-button"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;