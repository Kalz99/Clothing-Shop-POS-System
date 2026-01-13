import React from 'react';
import type { CartItem } from '../types';

interface ReceiptProps {
    cart: CartItem[];
    total: number;
    discount?: number;
    cashierName: string;
    date: string;
    paymentMethod: 'cash' | 'card';
    customerName?: string;
    customerMobile?: string;
    invoiceNo?: string;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ cart, total, discount = 0, cashierName, date, paymentMethod, customerName, customerMobile, invoiceNo }, ref) => {
    return (
        <div className="hidden print:block font-mono text-sm p-2 w-[80mm]" ref={ref}>
            <div className="text-center mb-4">
                <h1 className="text-xl font-bold uppercase">Clothing Shop</h1>
                <p>123 Fashion Street</p>
                <p>Tel: +1 234 567 8900</p>
                {invoiceNo && <p className="font-bold mt-1">Invoice: {invoiceNo}</p>}
            </div>

            <div className="mb-2 text-xs border-b border-black pb-2">
                <p>Date: {date}</p>
                <p>Cashier: {cashierName}</p>
                {customerName && <p>Customer: {customerName}</p>}
                {customerMobile && <p>Mobile: {customerMobile}</p>}
                <p>Payment Mode: {paymentMethod === 'cash' ? 'CASH' : 'CARD'}</p>
            </div>

            <table className="w-full text-left mb-2">
                <thead>
                    <tr className="border-b border-black border-dashed">
                        <th className="py-1">Item</th>
                        <th className="py-1 text-right">Qty</th>
                        <th className="py-1 text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id}>
                            <td className="py-1 pr-2 truncate max-w-[40mm]">{item.name}</td>
                            <td className="py-1 text-right align-top">{item.quantity}</td>
                            <td className="py-1 text-right align-top">
                                {(item.price * item.quantity).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-t border-black border-dashed pt-2 mb-4">
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>Rs. {total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between mb-2">
                        <span>Discount:</span>
                        <span>- Rs. {discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                    <span>TOTAL</span>
                    <span>Rs. {Math.max(0, total - discount).toFixed(2)}</span>
                </div>
            </div>

            <div className="text-center text-xs space-y-1">
                <p>Thank you for shopping with us!</p>
                <p>*** customer copy ***</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';
