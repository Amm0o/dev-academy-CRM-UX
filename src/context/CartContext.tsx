import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, Cart, CartItemRequest } from '../services';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  totalAmount: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Calculate derived values
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalAmount = cart?.totalCartValue || 0;

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart(user.id);
      
      if (response.data) {
        setCart(response.data);
      } else {
        setError(response.error || 'Failed to fetch cart');
      }
    } catch (err) {
      setError('Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Fetch cart on mount and when auth changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user?.id, fetchCart]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    if (!user?.id) {
      setError('You must be logged in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const request: CartItemRequest = {
        userId: user.id,
        productId,
        quantity
      };

      const response = await cartService.addToCart(request);
      
      if (response.data) {
        // Response includes updated cart
        setCart(response.data);
      } else {
        setError(response.error || 'Failed to add item to cart');
        throw new Error(response.error || 'Failed to add item to cart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user?.id) {
      setError('You must be logged in to update cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const request: CartItemRequest = {
        userId: user.id,
        productId,
        quantity
      };

      const response = await cartService.updateCartItem(request);
      
      if (response.data) {
        setCart(response.data);
      } else {
        setError(response.error || 'Failed to update cart item');
        throw new Error(response.error || 'Failed to update cart item');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: number) => {
    if (!user?.id) {
      setError('You must be logged in to remove items from cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await cartService.removeFromCart(user.id, productId);
      
      if (response.data) {
        // Refresh cart after removal
        await fetchCart();
      } else {
        setError(response.error || 'Failed to remove item from cart');
        throw new Error(response.error || 'Failed to remove item from cart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user?.id) {
      setError('You must be logged in to clear cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await cartService.clearCart(user.id);
      
      if (response.data) {
        setCart(null);
      } else {
        setError(response.error || 'Failed to clear cart');
        throw new Error(response.error || 'Failed to clear cart');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};