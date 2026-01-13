export type Role = 'manager' | 'cashier';

export interface User {
    id: string;
    name: string;
    role: Role;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: Role) => Promise<boolean>;
    logout: () => void;
}

export interface Product {
    id: string;
    barcode: string;
    name: string;
    price: number; // This is the Selling Price
    costPrice: number; // This is the Buying Price
    category?: string;
    stock: number;
    brand?: string;
    size?: string;
    color?: string;
    createdAt?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface CartItem extends Product {
    quantity: number;
}
