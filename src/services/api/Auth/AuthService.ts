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
        return this.post('/user/register');
    }

    isAuthethicated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getCurrentUser(): any {
        const useStr = localStorage.getItem('user');
        return useStr ? JSON.stringify(useStr) : null;
    }
}

export default new AuthService();