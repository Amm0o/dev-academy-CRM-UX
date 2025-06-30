import { ApiResponse, ApiService } from "../ApiService";

export interface CartItemRequest {
  userId: number;
  productId: number;
  quantity: number;
}

export interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  productName?: string; // Optional until backend is fixed
  quantity: number;
  unitPrice: number;
  itemTotal: number; // Changed from totalPrice to match API
}

export interface Cart {
  cartId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  totalCartValue: number; // Changed from totalAmount to match API
  id: number;
}

class CartService extends ApiService {
  async getCart(userId: number): Promise<ApiResponse<Cart>> {
    return this.get<Cart>(`/cart/${userId}`);
  }

  async addToCart(item: CartItemRequest): Promise<ApiResponse<any>> {
    return this.post('/cart/add', item);
  }

  async updateCartItem(item: CartItemRequest): Promise<ApiResponse<any>> {
    return this.put('/cart/update', item);
  }

  async removeFromCart(userId: number, productId: number): Promise<ApiResponse<any>> {
    return this.delete(`/cart/${userId}/item/${productId}`);
  }

  async clearCart(userId: number): Promise<ApiResponse<any>> {
    return this.delete(`/cart/${userId}`);
  }
}

export default new CartService();