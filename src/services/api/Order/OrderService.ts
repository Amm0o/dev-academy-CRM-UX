import { ApiResponse, ApiService } from "../ApiService";

export interface OrderItem {
  productId: number;
  quantity: number;
  productName?: string;
  unitPrice?: number;
  lineTotal?: number;
}

export interface CreateOrderRequest {
  userNameOrder: string;
  customerId: number;
  orderDescription: string;
  items: OrderItem[];
}

export interface OrderItemDetail {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  orderId: number;
  orderGuid: string;
  customerId: number;
  userNameOrder: string;
  orderDescription: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items?: OrderItemDetail[];
}

export interface CreateOrderResponse {
  orderGuid: string;
  customerId: number;
  totalAmount: number;
  status: string;
  itemCount: number;
}

class OrderService extends ApiService {
  /**
   * Create a new order
   * @param order - The order creation request
   * @returns The created order details
   */
  async createOrder(order: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
    return this.post<CreateOrderResponse>('/order', order);
  }

  /**
   * Get a single order by its GUID
   * @param orderGuid - The unique order identifier
   * @returns The complete order with items
   */
  async getOrder(orderGuid: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/order/${orderGuid}`);
  }

  /**
   * Get all orders for a specific customer
   * @param customerId - The customer ID
   * @returns List of orders (without item details)
   */
  async getCustomerOrders(customerId: number): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(`/order/customer/${customerId}`);
  }

  /**
   * Helper method to create an order from cart
   * @param userEmail - The email of the user placing the order
   * @param customerId - The customer ID
   * @param items - The items from the cart
   * @param description - Optional order description
   * @returns The created order details
   */
  async createOrderFromCart(
    userEmail: string,
    customerId: number,
    items: Array<{ productId: number; quantity: number }>,
    description: string = ''
  ): Promise<ApiResponse<CreateOrderResponse>> {
    const orderRequest: CreateOrderRequest = {
      userNameOrder: userEmail,
      customerId: customerId,
      orderDescription: description,
      items: items
    };

    return this.createOrder(orderRequest);
  }

  /**
   * Check if an order exists
   * @param orderGuid - The unique order identifier
   * @returns Boolean indicating if the order exists
   */
  async orderExists(orderGuid: string): Promise<boolean> {
    try {
      const response = await this.getOrder(orderGuid);
      return response.status === 200 && !!response.data;
    } catch {
      return false;
    }
  }

  /**
   * Get order status
   * @param orderGuid - The unique order identifier
   * @returns The order status or null if not found
   */
  async getOrderStatus(orderGuid: string): Promise<string | null> {
    try {
      const response = await this.getOrder(orderGuid);
      return response.data?.status || null;
    } catch {
      return null;
    }
  }
}

export default new OrderService();