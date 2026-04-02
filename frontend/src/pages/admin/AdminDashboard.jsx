import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Folder, MessageCircle, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { io } from 'socket.io-client';
import API_URL from '../../config/api';

const StatCard = ({ icon, label, value, color, bgColor, link, loading }) => (
    <Link to={link}>
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className={`p-4 ${bgColor} ${color} rounded-full`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                {loading ? (
                    <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                    <p className="text-3xl font-bold text-dark-900">{value}</p>
                )}
            </div>
        </motion.div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, messages: 0, orders: 0, pendingOrders: 0, totalRevenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${adminInfo?.token}` } };

            const [productsRes, categoriesRes, messagesRes, ordersRes] = await Promise.all([
                axios.get(`${API_URL}/api/products`),
                axios.get(`${API_URL}/api/categories`),
                axios.get(`${API_URL}/api/messages`, config),
                axios.get(`${API_URL}/api/orders`, config),
            ]);

            const orders = ordersRes.data;
            const pendingOrders = orders.filter(o => o.status === 'En attente').length;
            const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

            setStats({
                products: productsRes.data.length,
                categories: categoriesRes.data.length,
                messages: messagesRes.data.length,
                orders: orders.length,
                pendingOrders,
                totalRevenue
            });

            // Show last 5 orders
            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            console.error('Dashboard stats error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Real-time: update when a new order comes in
        const socket = io(API_URL);
        socket.on('newOrder', () => {
            fetchStats(); // Refresh all stats instantly
        });
        socket.on('orderStatusUpdated', () => {
            fetchStats();
        });

        return () => socket.disconnect();
    }, []);

    const statusColors = {
        'En attente': 'bg-yellow-100 text-yellow-800',
        'En traitement': 'bg-blue-100 text-blue-800',
        'Expédiée': 'bg-purple-100 text-purple-800',
        'Livrée': 'bg-green-100 text-green-800',
        'Annulée': 'bg-red-100 text-red-800',
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-dark-900">Tableau de Bord</h1>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <TrendingUp size={16} />
                    Actualiser
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<Package size={24} />} label="Produits Actifs" value={stats.products} color="text-blue-600" bgColor="bg-blue-50" link="/admin/products" loading={loading} />
                <StatCard icon={<Folder size={24} />} label="Catégories" value={stats.categories} color="text-purple-600" bgColor="bg-purple-50" link="/admin/categories" loading={loading} />
                <StatCard icon={<ShoppingCart size={24} />} label="Total Commandes" value={stats.orders} color="text-gold-600" bgColor="bg-yellow-50" link="/admin/orders" loading={loading} />
                <StatCard icon={<Clock size={24} />} label="En Attente" value={stats.pendingOrders} color="text-orange-600" bgColor="bg-orange-50" link="/admin/orders" loading={loading} />
            </div>

            {/* Revenue Banner */}
            {!loading && (
                <div className="bg-dark-900 text-white rounded-xl p-6 mb-10 flex justify-between items-center shadow-lg">
                    <div>
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Chiffre d'affaires Total</p>
                        <p className="text-4xl font-serif font-bold mt-1">{stats.totalRevenue.toFixed(2)} <span className="text-gold-500 text-2xl">MAD</span></p>
                    </div>
                    <div className="w-16 h-16 bg-gold-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <TrendingUp size={32} className="text-gold-400" />
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-serif text-xl text-dark-900">Commandes Récentes</h2>
                    <Link to="/admin/orders" className="text-sm text-gold-600 hover:underline font-medium">Voir toutes →</Link>
                </div>
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : recentOrders.length === 0 ? (
                    <p className="p-8 text-center text-gray-400 italic">Aucune commande pour l'instant.</p>
                ) : (
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Client</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-dark-900 text-sm">{order.customerName}</div>
                                        <div className="text-xs text-gray-400">{order.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gold-600 text-sm">{order.totalPrice} MAD</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
