import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Home, Menu, X } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-40 shadow-sm">
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="ml-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                    Melmos Stock
                </h1>
            </div>

            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl transition-transform duration-300 ease-in-out
                    md:relative md:translate-x-0 md:shadow-sm
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent break-words hidden md:block">
                            Melmos Kitchen Stock Manager
                        </h1>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent md:hidden">
                            Menu
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Hello, {user?.username}</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { navigate('/'); closeMenu(); }}
                        className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 group"
                    >
                        <Home size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-medium">Dashboard</span>
                    </button>

                    {user?.role === 'admin' && (
                        <button
                            onClick={() => { navigate('/history'); closeMenu(); }}
                            className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 group"
                        >
                            <span className="text-xl w-5 text-center text-gray-400 group-hover:text-blue-600 transition-colors">📅</span>
                            <span className="font-medium">History</span>
                        </button>
                    )}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200 group">
                        <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8 pt-20 md:pt-8 w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
