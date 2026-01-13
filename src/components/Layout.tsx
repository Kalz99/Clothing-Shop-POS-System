import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, PlusCircle, LogOut, Shirt, Menu, X, Tag, FileText } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out relative ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
                    }`}
            >
                {/* Close Button (Inside Sidebar) */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors md:hidden"
                >
                    <X className="w-5 h-5" />
                </button>
                {/* Desktop Close Button (always visible in sidebar if open) */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-6 right-4 p-1 text-gray-400 hover:text-white transition-colors hidden md:block"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Logo Area */}
                <div className="p-6 border-b border-gray-800 min-w-[16rem] pr-12">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Shirt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Luxn</h1>
                            <p className="text-xs text-gray-400">POS System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 min-w-[16rem]">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <LayoutDashboard className={`w-5 h-5 ${isActive('/') ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                        <span className="font-medium">Billing</span>
                    </Link>

                    <Link
                        to="/invoices"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/invoices')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <FileText className={`w-5 h-5 ${isActive('/invoices') ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                        <span className="font-medium">Invoices</span>
                    </Link>

                    {user?.role === 'manager' && (
                        <>
                            <Link
                                to="/sales"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/sales')
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <ShoppingBag className={`w-5 h-5 ${isActive('/sales') ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className="font-medium">Sales Reports</span>
                            </Link>
                            <Link
                                to="/inventory"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/inventory')
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <PlusCircle className={`w-5 h-5 ${isActive('/inventory') ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className="font-medium">Inventory</span>
                            </Link>
                            <Link
                                to="/categories"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive('/categories')
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Tag className={`w-5 h-5 ${isActive('/categories') ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                <span className="font-medium">Categories</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* User Profile / Logout (Bottom) */}
                <div className="p-4 border-t border-gray-800 min-w-[16rem]">
                    <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-750 transition-colors">
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-red-400 p-2 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header
                    className={`${isActive('/')
                        ? 'absolute top-0 left-0 w-full z-10 pointer-events-none'
                        : 'bg-white border-b border-gray-200 shadow-sm'
                        } px-6 py-3 flex items-center justify-between`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 pointer-events-auto ${isSidebarOpen ? 'invisible' : ''}`}
                        aria-label="Open Sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Additional header items can go here */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-hidden relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
