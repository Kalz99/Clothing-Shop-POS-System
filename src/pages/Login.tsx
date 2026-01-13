import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, UserCircle, Store } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role: 'manager' | 'cashier') => {
        if (!email || !password) return;
        const success = await login(email, password, role);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">Clothing POS</h1>
                    <p className="text-slate-500">Sign in to access the system</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleLogin('manager')}
                            className="group relative flex flex-col items-center justify-center p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                            <UserCircle className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                            <span className="font-medium text-slate-600 group-hover:text-blue-700">Manager</span>
                        </button>
                        <button
                            onClick={() => handleLogin('cashier')}
                            className="group relative flex flex-col items-center justify-center p-4 border-2 border-slate-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                        >
                            <Store className="w-8 h-8 text-slate-400 group-hover:text-purple-600 mb-2 transition-colors" />
                            <span className="font-medium text-slate-600 group-hover:text-purple-700">Cashier</span>
                        </button>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-400 mt-8">
                    System v1.0.0
                </div>
            </div>
        </div>
    );
};

export default Login;
