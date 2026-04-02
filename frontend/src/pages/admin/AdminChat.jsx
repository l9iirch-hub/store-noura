import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send, User } from 'lucide-react';

let socket;

const AdminChat = () => {
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchSessions();

        socket = io('http://localhost:5000');

        socket.on('sessionUpdated', (updatedSession) => {
            setSessions(prev => {
                const copy = [...prev];
                const idx = copy.findIndex(s => s.guestId === updatedSession.guestId);
                if (idx >= 0) {
                    copy[idx] = updatedSession;
                } else {
                    copy.unshift(updatedSession);
                }
                return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            });
        });

        return () => {
            if (socket) socket.disconnect();
        }
    }, []);

    const fetchSessions = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/chat', config);
            setSessions(data);
        } catch (e) {
            console.error('Fetch sessions admin error:', e);
        }
    }

    const activeSession = sessions.find(s => s.guestId === activeSessionId);

    useEffect(() => {
        if (activeSession && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeSession?.messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeSessionId) return;

        socket.emit('sendMessage', {
            guestId: activeSessionId,
            sender: 'Admin',
            text: input
        });

        // Optimistically clear input (socket updating the session handles UI append instantly)
        setInput('');
    }

    return (
        <div className="p-8 h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-3xl font-serif text-dark-900 mb-6 shrink-0 border-b pb-4">Shabka de T9adya (Chat Réel-Temps)</h1>

            <div className="bg-white flex-1 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex">

                {/* Sidemenu - sessions */}
                <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 bg-white font-bold text-gray-700 text-sm tracking-wider uppercase flex justify-between items-center">
                        <span>Conversations ({sessions.length})</span>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {sessions.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-sm font-medium">Aucune conversation active. Les clients vous écrivant apparaîtront ici.</div>
                        ) : sessions.map(session => (
                            <div
                                key={session.guestId}
                                onClick={() => setActiveSessionId(session.guestId)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between 
                              ${activeSessionId === session.guestId ? 'bg-gold-50 border-l-4 border-l-gold-500' : ''}`}
                            >
                                <div>
                                    <h4 className="font-bold text-dark-900 truncate max-w-[150px]">{session.guestName || "Visiteur Anonyme"}</h4>
                                    <span className="text-xs text-gray-500 font-medium">{new Date(session.updatedAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                {/* Indicator for unread messages if relevant */}
                                {session.unreadByAdmin > 0 && session.guestId !== activeSessionId && (
                                    <div className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                                        !
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="w-2/3 flex flex-col bg-white relative h-full">
                    {!activeSession ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4 bg-gray-50">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2"><User size={40} className="text-white" /></div>
                            <p className="font-serif text-lg">Sélectionnez une conversation</p>
                        </div>
                    ) : (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-gray-100 bg-white shadow-sm shrink-0 flex justify-between items-center z-10 w-full">
                                <div>
                                    <h3 className="font-bold text-dark-900 text-lg flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center bg-gold-100 text-gold-600"><User size={16} /></div>
                                        {activeSession.guestName || "Visiteur"}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1 uppercase font-semibold">ID: {activeSession.guestId.substring(0, 15)}...</p>
                                </div>
                                <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] uppercase font-black border border-green-100 tracking-wider">Actif</div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col w-full space-y-4">
                                {activeSession.messages.length === 0 && <p className="text-center text-sm text-gray-400 mt-10">Aucun message pour l'instant.</p>}
                                {activeSession.messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm font-medium
                                            ${msg.sender === 'Admin' ? 'bg-dark-900 text-white rounded-br-none' : 'bg-white text-dark-900 border border-gray-200 rounded-bl-none'}`}
                                        >
                                            {msg.text}
                                            <div className={`text-[10px] mt-2 block font-semibold ${msg.sender === 'Admin' ? 'text-gray-400 text-right' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} className="h-1" />
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02)]">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Écrivez votre réponse ici..."
                                    className="flex-1 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm bg-gray-50 text-dark-900 placeholder:text-gray-400 font-medium"
                                />
                                <button type="submit" disabled={!input.trim()} className="bg-gold-600 text-white p-3.5 rounded-full hover:bg-dark-900 transition-colors shadow-md disabled:opacity-50 disabled:hover:bg-gold-600">
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminChat;
