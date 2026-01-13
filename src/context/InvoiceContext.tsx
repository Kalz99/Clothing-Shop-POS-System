import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types';
import api from '../lib/axios';

export interface Invoice {
    id: string;
    invoiceNo: string;
    date: string;
    customerName: string;
    customerMobile: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: 'cash' | 'card';
    cashierName: string;
}

interface InvoiceContextType {
    invoices: Invoice[];
    addInvoice: (invoice: Omit<Invoice, 'id' | 'date'>) => Promise<Invoice | null>;
    getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/sales');
            setInvoices(res.data);
        } catch (err) {
            console.error('Error fetching invoices:', err);
        }
    };

    const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'date'>) => {
        try {
            // Backend expects invoiceNo, customersName, items, subtotal, discount, total, paymentMethod
            // My Invoice interface matches this mostly.
            // Note: invoiceData has `items` which are CartItems.
            // Backend `sales.js` endpoint handles `items` array directly.

            const res = await api.post('/sales', invoiceData);

            // Re-fetch or manually append. 
            // The backend returns { message, saleId, invoiceNo }. 

            const newInvoice: Invoice = {
                ...invoiceData,
                id: res.data.saleId.toString(),
                invoiceNo: res.data.invoiceNo,
                date: new Date().toISOString()
            };
            setInvoices(prev => [newInvoice, ...prev]);
            return newInvoice;
        } catch (err) {
            console.error('Error creating invoice:', err);
            return null;
        }
    };

    const getInvoice = (id: string) => {
        return invoices.find(inv => inv.id === id);
    };

    return (
        <InvoiceContext.Provider value={{ invoices, addInvoice, getInvoice }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoices = () => {
    const context = useContext(InvoiceContext);
    if (context === undefined) {
        throw new Error('useInvoices must be used within a InvoiceProvider');
    }
    return context;
};
