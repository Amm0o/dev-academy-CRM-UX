export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export abstract class ApiService {
    protected baseUrl: string = "/api";

    protected async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const token = localStorage.getItem('authToken');

            const config: RequestInit = {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && {Authorization: `Bearer ${token}`}),
                    ...options.headers,
                }
            };


            const response = await fetch(`${this.baseUrl}${endpoint}`, config)

            if(!response.ok) {
                if(response.status === 401) {
                    // Unauthorized
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
                throw new Error(`HTTP error! status ${response.status}`);
            }

            const data = await response.json();
            return {data, status: response.status}

        } catch (error) {
            console.error('Api request failed', error);
            return {
                error: error instanceof Error ? error.message : 'An error occurred',
                status: 0,
            };
        }
    }


    protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {method: 'GET'});
    }

    protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }


    protected async put<T>(endpoint: string , data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {method: 'DELETE'});
    }
}