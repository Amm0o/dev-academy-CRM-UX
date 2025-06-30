import React, {createContext, useContext, useState, useEffect} from 'react';
import { authService, LoginRequest, LoginResponse } from '../services';

interface AuthContextType {
    isAuthenticated: boolean;
    user: LoginResponse['user'] | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<LoginResponse['user'] | null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // check if user is already logged in
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');

        if(token && userStr) {
            try {
                const userData = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.log('Failed to parse user data');
                // Clear invalid data
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);


    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials);
            if(response.data) {
                const userData = response.data.user;
                
                if (userData) {
                    const formattedUser = {
                        id: userData.id || userData.id,
                        email: userData.email || userData.email,
                        name: userData.name || userData.name,
                        role: userData.role || userData.role,
                    }
                    
                    setIsAuthenticated(true);
                    setUser(formattedUser);
                } else {
                    throw new Error('Invalid response format from server');
                }
            } else {
                // Pass through the actual error message from the backend
                throw new Error(response.error || 'Login failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Login error in AuthContext:', error);
            
            // Make sure we're not authenticated on error
            setIsAuthenticated(false);
            setUser(null);
            
            // Clear any invalid tokens
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Re-throw the error with proper message
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.response?.data) {
                // Handle string responses from backend
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    throw new Error(errorData);
                } else if (errorData.error) {
                    throw new Error(errorData.error);
                } else {
                    throw new Error('Login failed');
                }
            } else if (error.message) {
                throw error;
            } else {
                throw new Error('An unexpected error occurred during login');
            }
        }
    }


    const logout = async () => {
        const token = localStorage.getItem('authToken');
        if(token) {
            try {
                await authService.logout(token);
            } catch (error) {
                console.error('Logout error:', error);
                // Continue with local logout even if server logout fails
            }
        }
        
        // Always clear local state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    }


    return ( 
        <AuthContext.Provider value={{isAuthenticated, user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}