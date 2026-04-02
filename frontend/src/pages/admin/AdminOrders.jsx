import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import API_URL from '../../config/api';
import { Filter, ArrowUpDown } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc' by date

    useEffect(() => {
        fetchOrders();

        const socket = io(API_URL);

        // WebSockets Real-time listeners
        socket.on('newOrder', (order) => {
            setOrders(prev => [order, ...prev]);
        });

        socket.on('orderStatusUpdated', (updatedOrder) => {
            setOrders(prev => prev.map(o => o._id === updatedOrder._id ? updatedOrder : o));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        let result = [...orders];

        // Filtrage
        if (statusFilter !== 'All') {
            result = result.filter(o => o.status === statusFilter);
        }

        // Tri par date
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        setFilteredOrders(result);
    }, [orders, statusFilter, sortOrder]);

    const fetchOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`${API_URL}/api/orders/${id}`, { status: newStatus }, config);
            // La mise à jour de l'état se fera automatiquement en temps réel via le websocket
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Erreur de mise à jour:\n${msg}`);
        }
    };

    const statuses = ['En attente', 'En traitement', 'Expédiée', 'Livrée', 'Annulée'];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-dark-900">Gestion des Commandes</h1>

                <div className="flex items-center gap-4">
                    {/* Tri */}
                    <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="bg-white border border-gray-200 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <ArrowUpDown size={18} className="text-gray-500" />
                        Trier: {sortOrder === 'desc' ? 'Récentes' : 'Anciennes'}
                    </button>
                    {/* Filtrage */}
                    <div className="relative flex items-center">
                        <Filter size={18} className="absolute left-3 text-gold-500 pointer-events-none" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-gray-200 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-gold-500 appearance-none min-w-[200px] font-medium text-gray-700 cursor-pointer">
                            <option value="All">Tous les statuts</option>
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left bg-white whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs text-gray-500">
                        <tr>
                            <th className="px-6 py-4">ID Commande</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4 text-center">Statut (Réel-Temps)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">Aucune commande trouvée.</td></tr>
                        ) : filteredOrders.map(order => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('fr-FR')}</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-semibold text-dark-900">{order.customerName}</div>
                                    <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                                    <div className="text-gray-500 text-xs">{order.customerPhone}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gold-600">{order.totalPrice.toFixed(2)} MAD</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="relative inline-block w-full max-w-[160px]">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`w-full px-3 py-1.5 rounded-full text-xs font-bold focus:outline-none cursor-pointer appearance-none text-center shadow-sm border
                         ${order.status === 'En attente' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                                                    order.status === 'En traitement' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                        order.status === 'Expédiée' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                                            order.status === 'Livrée' ? 'bg-green-50 text-green-800 border-green-200' :
                                                                'bg-red-50 text-red-800 border-red-200'}`}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
