import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductManagement from '../components/Admin/ProductManagement'
import UserManagement from '../components/Admin/UserManagement';
import './styles/AdminPage.css';

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your CRM products and users</p>
      </header>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' ? <ProductManagement /> : <UserManagement />}
      </div>
    </div>
  );
};

export default AdminPage;