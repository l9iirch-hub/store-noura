import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Mail } from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/messages', config);
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous supprimer ce message ?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`http://localhost:5000/api/messages/${id}`, config);
                fetchData();
            } catch (error) {
                console.error(error);
                alert('Erreur de suppression.');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-dark-900">Messages de Contact</h1>
            </div>

            <div className="grid gap-6">
                {messages.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg text-center text-gray-500 border border-gray-100 shadow-sm">Aucun message de contact reçu pour l'instant.</div>
                ) : messages.map(msg => (
                    <div key={msg._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-shadow hover:shadow-md">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-gold-50 text-gold-600 rounded-full mt-1 shrink-0">
                                <Mail size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-1">
                                    <h3 className="text-lg font-bold text-dark-900 font-serif">{msg.name}</h3>
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{new Date(msg.createdAt).toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="text-sm font-medium text-gold-600 mb-3 flex gap-4">
                                    <p>{msg.email}</p>
                                    {msg.phone && <p>Tél: {msg.phone}</p>}
                                </div>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded border border-gray-100 italic">{msg.content}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(msg._id)} className="text-gray-400 hover:text-red-500 p-2 shrink-0 self-end md:self-auto transition-colors"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminMessages;
