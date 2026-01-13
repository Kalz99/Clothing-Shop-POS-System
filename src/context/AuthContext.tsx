import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Role, AuthState } from '../types';
import api from '../lib/axios';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string, role: Role): Promise<boolean> => {
        try {
            // Using the actual password entered by the user
            const username = email.split('@')[0];

            const res = await api.post('/auth/login', { username, password, role });
            setUser(res.data.user);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials or if the server is running.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
