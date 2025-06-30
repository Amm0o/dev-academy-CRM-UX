import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './styles/CartPage.css';

const CartPage: React.FC = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart, totalAmount, itemCount } = useCart();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading && !cart) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-message">
          <p>{error}</p>
          <Link to="/products" className="continue-shopping-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/products" className="shop-now-button">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h1>Shopping Cart</h1>
        <Link to="/products" className="continue-shopping-link">
          ← Continue Shopping
        </Link>
      </header>

      <div className="cart-content">
        <div className="cart-items">
          <div className="cart-items-header">
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <button onClick={handleClearCart} className="clear-cart-button">
              Clear Cart
            </button>
          </div>

          {cart.items.map((item) => (
            <div key={item.productId} className="cart-item">
            <div className="item-info">
            <h3 className="item-name">
                {item.productName || `Product #${item.productId}`}
            </h3>
            <p className="item-price">{formatPrice(item.unitPrice)}</p>
            </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingItems.has(item.productId)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        handleQuantityChange(item.productId, value);
                      }
                    }}
                    disabled={updatingItems.has(item.productId)}
                    min="1"
                  />
                  <button
                    className="quantity-button"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    disabled={updatingItems.has(item.productId)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatPrice(item.itemTotal)}
                </div>

                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={updatingItems.has(item.productId)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({itemCount} items)</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <button className="checkout-button" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;