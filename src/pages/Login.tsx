import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, UserCircle, Store } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'manager' | 'cashier' | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password || !role) return;
        const success = await login(username, password, role);
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
                    <p className="text-slate-500">Select role and sign in</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('manager')}
                            className={`group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${role === 'manager'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                                }`}
                        >
                            <UserCircle className={`w-8 h-8 mb-2 transition-colors ${role === 'manager' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-400'}`} />
                            <span className={`font-medium ${role === 'manager' ? 'text-blue-700' : 'text-slate-600'}`}>Manager</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('cashier')}
                            className={`group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${role === 'cashier'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                                }`}
                        >
                            <Store className={`w-8 h-8 mb-2 transition-colors ${role === 'cashier' ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-400'}`} />
                            <span className={`font-medium ${role === 'cashier' ? 'text-purple-700' : 'text-slate-600'}`}>Cashier</span>
                        </button>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!role}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Login
                    </button>
                </form>

                <div className="text-center text-xs text-slate-400 mt-8">
                    System v1.0.0
                </div>
            </div>
        </div>
    );
};

export default Login;
