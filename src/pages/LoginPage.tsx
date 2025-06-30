import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err); // Add logging to debug
      
      // Handle different error scenarios based on backend responses
      const errorMessage = err.message || 'Login failed';
      
      if (errorMessage.toLowerCase().includes('invalid email address')) {
        setFieldErrors({ email: 'This email is not registered' });
        setError('No account found with this email address');
      } else if (errorMessage.toLowerCase().includes('invalid email or password')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage.toLowerCase().includes('unauthorized')) {
        setError('Authentication failed. Please check your credentials.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    // Update the field value
    if (field === 'email') {
      setEmail(value);
      // Only clear email-specific errors when typing in email field
      if (fieldErrors.email) {
        setFieldErrors(prev => ({ ...prev, email: undefined }));
      }
    } else {
      setPassword(value);
      // Only clear password-specific errors when typing in password field
      if (fieldErrors.password) {
        setFieldErrors(prev => ({ ...prev, password: undefined }));
      }
    }
    
    // Don't clear general errors immediately - let user see them
    // Only clear when they submit again
  };

  // Clear general error when user starts typing after seeing an error
  useEffect(() => {
    if (error && (email || password)) {
      const timer = setTimeout(() => {
        // Only clear error after user has had time to read it
        if (error && loading === false) {
          // Keep the error visible for at least 5 seconds
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [email, password, error, loading]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login to Dev Academy CRM</h2>
        
        {successMessage && (
          <div className="success-message" role="alert">
            <span className="success-icon">✓</span>
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className={fieldErrors.email ? 'error' : ''}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <span id="email-error" className="field-error">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              className={fieldErrors.password ? 'error' : ''}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password && (
              <span id="password-error" className="field-error">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠</span>
              {error}
              <button
                type="button"
                className="error-close"
                onClick={() => setError('')}
                aria-label="Close error message"
              >
                ×
              </button>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
          <Link to="/register" className="register-link">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;