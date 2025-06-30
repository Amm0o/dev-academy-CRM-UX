import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import CartIcon from '../components/Cart/CartIcon';
import './styles/LandingPage.css';

const LandingPage: React.FC = () => {
    const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthAction = async () => {
        // Clear any previous errors
        setError(null);

        if (isAuthenticated) {
            try {
                setIsLoggingOut(true);
                await logout();
                // Only navigate after successful logout
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Logout failed!', error);
                setError('Failed to logout. Please try again.');
            } finally {
                setIsLoggingOut(false);
            }
        } else {
            navigate('/login');
        }
    };

    // Show loading state while auth context is initializing
    if (authLoading) {
        return (
            <div className="landing-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1 className="landing-title">Dev Academy CRM</h1>
                <p className="landing-subtitle">Your Complete Customer Relationship Management Solution</p>
            </header>

            <div className="auth-section">
                {isAuthenticated && user && (
                    <p className="welcome-message">
                        Welcome, <span className="user-email">{user.email}</span>!
                    </p>
                )}
                
                {error && (
                    <div className="error-banner" role="alert">
                        {error}
                    </div>
                )}
                
                <button 
                    className="auth-button"
                    onClick={handleAuthAction}
                    disabled={isLoggingOut}
                    aria-label={isAuthenticated ? 'Logout' : 'Login'}
                >
                    {isLoggingOut ? 'Logging out...' : (isAuthenticated ? 'Logout' : 'Login')}
                </button>

                {isAuthenticated && (
                    <nav className="nav-links" role="navigation" aria-label="Main navigation">
                        <Link to="/products" className="nav-link">Products</Link>
                        <Link to="/orders" className="nav-link">Orders</Link>
                        {/* <Link to="/cart" className="nav-link">Cart</Link> */}
                        <CartIcon />
                    </nav>
                )}
            </div>
        </div>
    );
};

export default LandingPage;