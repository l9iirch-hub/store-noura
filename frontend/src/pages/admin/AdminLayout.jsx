import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, MessageSquare, ClipboardList, LogOut } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const adminInfo = localStorage.getItem('adminInfo');
        if (!adminInfo) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-dark-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <Link to="/" className="text-2xl font-serif text-gold-500 hover:text-white transition-colors duration-300">
                        Noura Admin
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <LayoutDashboard size={20} />
                        Tableau de Bord
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <ShoppingBag size={20} />
                        Produits & Commandes
                    </Link>
                    <Link to="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <FolderTree size={20} />
                        Catégories
                    </Link>
                    <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <ClipboardList size={20} />
                        Commandes
                    </Link>
                    <Link to="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <MessageSquare size={20} />
                        Messages
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-500 hover:bg-gray-800 rounded transition-colors">
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
