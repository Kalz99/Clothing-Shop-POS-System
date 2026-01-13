import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Category } from '../types';
import api from '../lib/axios';

interface CategoryContextType {
    categories: Category[];
    addCategory: (name: string) => void;
    updateCategory: (id: string, name: string) => void;
    deleteCategory: (id: string) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const addCategory = async (name: string) => {
        try {
            const res = await api.post('/categories', { name });
            setCategories(prev => [...prev, res.data]);
        } catch (err) {
            console.error('Error adding category:', err);
        }
    };

    const updateCategory = async (id: string, name: string) => {
        try {
            await api.put(`/categories/${id}`, { name });
            setCategories(prev => prev.map(c => c.id === id ? { ...c, name: name.trim() } : c));
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategories must be used within a CategoryProvider');
    }
    return context;
};
