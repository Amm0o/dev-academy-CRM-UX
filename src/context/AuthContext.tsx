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
            }
        }
        setLoading(false);
    }, []);


    const login = async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
            if(response.data) {
                const userData = response.data.user;

                const formattedUser = {
                    id: userData?.id,
                    email: userData?.email,
                    name: userData?.name,
                    role: userData?.role,
                }

                setIsAuthenticated(true);
                setUser(formattedUser);
            } else {
                throw new Error(response.error || 'Login Failed!')
            }
    }

    const logout = async () => {
        const token = localStorage.getItem('authToken');
        if(token) {
            await authService.logout(token);
        }
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