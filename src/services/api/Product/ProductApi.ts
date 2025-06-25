import { ApiService, ApiResponse } from "../ApiService";

export interface Product {
    productId: number;
    productName: string;
    productPrice: number;
    productStock: number;
    productDescription: string;
    prodcutCategory: string;
    updatedAt: string;
    createdAt: string;
}

export interface ProductRequest {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
}

class ProductService extends ApiService {
  async getProduct(productId: number): Promise<ApiResponse<Product>> {
    return this.get<Product>(`/product/${productId}`);
  }

  async getAllProducts(): Promise<ApiResponse<ProductsResponse>> {
    return this.get<ProductsResponse>('/product');
  }

  async createProduct(product: ProductRequest): Promise<ApiResponse<any>> {
    return this.post('/product/add', product);
  }

  async updateProduct(productId: number, product: ProductRequest): Promise<ApiResponse<any>> {
    return this.put(`/product/update/${productId}`, product);
  }

  async searchProducts(term: string, category?: string): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    if (term) params.append('search', term);
    if (category) params.append('category', category);
    
    return this.get<Product[]>(`/product/search?${params.toString()}`);
  }
}

export default new ProductService();