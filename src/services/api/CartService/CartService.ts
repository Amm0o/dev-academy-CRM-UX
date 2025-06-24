import { ApiResponse, ApiService } from "../ApiService";

export interface CartItemRequest {
  userId: number;
  productId: number;
  quantity: number;
}

export interface Cart {
  cartId: number;
  userId: number;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
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
    return this.delete(`/cart/${userId}/clear`);
  }
}

export default new CartService();