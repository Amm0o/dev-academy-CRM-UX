import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';


// Protected Route Component
const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({children}) => {

  const {isAuthenticated, loading} = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  // Only redirect if not authenticated AND not loading
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return(
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={
                <ProtectedRoute>
                  <ProductsPage/>
                </ProtectedRoute>
              }/>
              <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
              } />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;