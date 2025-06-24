import { ApiResponse, ApiService } from "../ApiService";

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userNameOrder: string;
  customerId: number;
  orderDescription: string;
  items: OrderItem[];
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
  items: any[];
}

class OrderService extends ApiService {
  async createOrder(order: CreateOrderRequest): Promise<ApiResponse<any>> {
    return this.post('/order', order);
  }

  async getOrder(orderGuid: string): Promise<ApiResponse<Order>> {
    return this.get<Order>(`/order/${orderGuid}`);
  }

  async getCustomerOrders(customerId: number): Promise<ApiResponse<Order[]>> {
    return this.get<Order[]>(`/order/customer/${customerId}`);
  }
}

export default new OrderService();