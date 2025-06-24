// Export services
export { default as authService } from './api/Auth/AuthService';
export { default as productService } from './api/Product/ProductApi';
export { default as orderService } from './api/Order/OrderService';
export { default as cartService } from './api/CartService/CartService';

// Export types from AuthService
export type { LoginRequest, LoginResponse, RegisterRequest } from './api/Auth/AuthService';

// Export types from ProductApi
export type { Product, ProductRequest } from './api/Product/ProductApi';

// Export types from OrderService
export type { Order, CreateOrderRequest, OrderItem } from './api/Order/OrderService';

// Export types from CartService
export type { Cart, CartItemRequest } from './api/CartService/CartService';

// Export base types
export type { ApiResponse } from './api/ApiService';