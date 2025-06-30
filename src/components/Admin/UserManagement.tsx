import React, { useState, useEffect } from 'react';
import { setupService, userService, User } from '../../services';
import { useAuth } from '../../context/AuthContext';
import './styles/UserManagement.css';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promotingUser, setPromotingUser] = useState<string | null>(null);
  const [demotingUser, setDemotingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getAllUsers();
      
      if (response.data?.data) {
        setUsers(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (email: string) => {
    try {
      setPromotingUser(email);
      setError(null);
      setSuccessMessage(null);
      
      const response = await setupService.promoteUserToAdmin(email);
      
      if (response.data) {
        setSuccessMessage(`Successfully promoted ${email} to admin`);
        // Refresh user list
        await fetchUsers();
        // Clear the search field if it was used
        if (searchEmail) {
          setSearchEmail('');
        }
      } else {
        setError(response.error || 'Failed to promote user');
      }
    } catch (err) {
      setError('An error occurred while promoting user');
    } finally {
      setPromotingUser(null);
    }
  };

  const demoteFromAdmin = async (email: string, userName: string) => {
    // Don't allow user to demote themselves
    if (currentUser?.email === email) {
      setError("You cannot demote yourself");
      return;
    }

    if (!window.confirm(`Are you sure you want to demote ${userName} from admin role?`)) {
      return;
    }

    try {
      setDemotingUser(email);
      setError(null);
      setSuccessMessage(null);
      
      const response = await userService.demoteAdmin(email);
      
      if (response.data) {
        setSuccessMessage(`Successfully demoted ${userName} from admin role`);
        // Refresh user list
        await fetchUsers();
      } else {
        setError(response.error || 'Failed to demote user');
      }
    } catch (err) {
      setError('An error occurred while demoting user');
    } finally {
      setDemotingUser(null);
    }
  };

  const deleteUser = async (userId: number, userEmail: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      return;
    }

    try {
      setDeletingUser(userId);
      setError(null);
      setSuccessMessage(null);
      
      const response = await userService.deleteUser(userId);
      
      if (response.data) {
        setSuccessMessage(`Successfully deleted user ${userEmail}`);
        // Refresh user list
        await fetchUsers();
      } else {
        setError(response.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting user');
    } finally {
      setDeletingUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      promoteToAdmin(searchEmail.trim());
    }
  };

  // Count admins to prevent demoting the last admin
  const adminCount = users.filter(u => u.role === 'Admin').length;

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <p className="users-count">Total Users: {users.length} | Admins: {adminCount}</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
          <button
            className="close-button"
            onClick={() => setError(null)}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          {successMessage}
          <button
            className="close-button"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      <div className="promote-user-section">
        <h3>Promote User to Admin</h3>
        <p className="section-description">
          Enter the email address of the user you want to promote to admin role.
        </p>
        <form onSubmit={handlePromoteSubmit} className="promote-form">
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Enter user email"
            required
            disabled={!!promotingUser}
          />
          <button type="submit" disabled={!!promotingUser}>
            {promotingUser ? 'Promoting...' : 'Promote to Admin'}
          </button>
        </form>
      </div>

      {users.length > 0 ? (
        <div className="users-section">
          <h3>All Users</h3>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        {user.role !== 'Admin' && (
                          <button
                            className="promote-button"
                            onClick={() => promoteToAdmin(user.email)}
                            disabled={promotingUser === user.email}
                            title="Promote to Admin"
                          >
                            {promotingUser === user.email ? 'Promoting...' : 'Make Admin'}
                          </button>
                        )}
                        {user.role === 'Admin' && user.email !== currentUser?.email && adminCount > 1 && (
                          <button
                            className="demote-button"
                            onClick={() => demoteFromAdmin(user.email, user.name)}
                            disabled={demotingUser === user.email}
                            title="Demote from Admin"
                          >
                            {demotingUser === user.email ? 'Demoting...' : 'Remove Admin'}
                          </button>
                        )}
                        <button
                          className="delete-button"
                          onClick={() => deleteUser(user.userId, user.email)}
                          disabled={deletingUser === user.userId}
                          title="Delete User"
                        >
                          {deletingUser === user.userId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-users">
          <p>No users found in the system.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;