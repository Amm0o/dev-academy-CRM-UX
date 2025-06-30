import { ApiResponse, ApiService } from "../ApiService";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

class AuthService extends ApiService {
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await this.post<LoginResponse>('/auth/login', credentials);

        if (response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    }


    async logout(token: string): Promise<ApiResponse<void>> {
        const response = await this.post<void>('/auth/logout', {token});

        if (response.status === 200) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }

        return response;
    }

    async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
        return this.post('/user/register', userData);
    }

    isAuthethicated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getCurrentUser(): any {
        const useStr = localStorage.getItem('user');
        return useStr ? JSON.parse(useStr) : null;
    }

      /**
   * Verify if the current user has admin privileges
   * @param token - The JWT token
   * @returns Boolean indicating admin status
   */
  async verifyAdminStatus(token: string): Promise<ApiResponse<boolean>> {
    try {
      // We can use the user endpoint to verify the role
      const response = await this.get<any>('/user/list-all-users');
      
      // If we can access this admin-only endpoint, user is admin
      return { 
        data: response.status === 200,
        status: response.status 
      };
    } catch (error: any) {
      // 403 means not admin, 401 means not authenticated
      if (error.response?.status === 403 || error.response?.status === 401) {
        return { 
          data: false,
          status: error.response.status 
        };
      }
      throw error;
    }
  }
    
}

export default new AuthService();