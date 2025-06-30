import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { orderService, Order } from '../services';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './styles/OrdersPage.css';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
    // Check if we have a success message from navigation
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location]);


  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getCustomerOrders(user.id);
      
      if (response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrderFromCart = async () => {
    if (!cart || cart.items.length === 0 || !user) {
      setError('Your cart is empty');
      return;
    }

    try {
      setCreatingOrder(true);
      setError(null);
      
      const response = await orderService.createOrderFromCart(
        user.email,
        user.id,
        cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        'Order from shopping cart'
      );
      
      if (response.data) {
        // Clear the cart after successful order
        await clearCart();
        // Refresh orders list
        await fetchOrders();
        // Show success message or navigate to order details
        alert('Order created successfully!');
      } else {
        setError(response.error || 'Failed to create order');
      }
    } catch (err) {
      setError('An error occurred while creating the order');
      console.error('Error creating order:', err);
    } finally {
      setCreatingOrder(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processed':
        return 'status-processed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <header className="orders-header">
        <h1>My Orders</h1>
        <div className="header-actions">
          <Link to="/" className="back-link">← Back to Home</Link>
          {cart && cart.items.length > 0 && (
            <button 
              className="create-order-button"
              onClick={createOrderFromCart}
              disabled={creatingOrder}
            >
              {creatingOrder ? 'Creating Order...' : 'Create Order from Cart'}
            </button>
          )}
        </div>
      </header>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <Link to="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.orderGuid} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderGuid.slice(0, 8)}</h3>
                  <p className="order-date">{formatDate(order.orderDate)}</p>
                </div>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="order-details">
                <p className="order-description">{order.orderDescription || 'No description'}</p>
                <div className="order-summary">
                  <span>Total Amount:</span>
                  <span className="order-total">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="view-details-button"
                  onClick={() => navigate(`/order/${order.orderGuid}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;