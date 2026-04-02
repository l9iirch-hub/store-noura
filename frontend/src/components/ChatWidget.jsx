import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let socket;

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [guestId, setGuestId] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        let gid = localStorage.getItem('noura_chat_id');
        if (!gid) {
            gid = 'guest_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('noura_chat_id', gid);
        }
        setGuestId(gid);

        socket = io('http://localhost:5000');

        const loadInitialChat = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/chat/${gid}`);
                if (data && data.messages) {
                    setMessages(data.messages);
                }
            } catch (e) {
                console.error('Chat load error', e);
            }
        };
        loadInitialChat();

        socket.on('receiveMessage', (data) => {
            if (data.sessionId === gid) {
                setMessages(prev => [...prev, data.message]);
            }
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        socket.emit('sendMessage', {
            guestId,
            guestName: 'Client',
            sender: 'Client',
            text: input
        });

        setInput('');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-80 sm:w-[380px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mb-4 flex flex-col"
                        style={{ height: '520px' }}
                    >
                        {/* Header */}
                        <div className="bg-dark-900 text-white p-4 flex justify-between items-center shadow-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold-600 flex items-center justify-center font-serif text-xl border-2 border-white shadow-sm">N</div>
                                <div>
                                    <h3 className="font-serif text-lg leading-tight font-bold">Noura Couture</h3>
                                    <p className="text-[11px] text-gray-300 font-medium">Support en ligne • Shabka</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors bg-dark-800 p-1.5 rounded-full">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 px-4 space-y-3 opacity-70">
                                    <MessageCircle size={48} className="text-gold-500 bg-gold-50 p-3 rounded-full" />
                                    <p className="text-sm font-medium">Posez vos questions sur nos collections ou commandes. Nous sommes là pour vous aider !</p>
                                </div>
                            ) : messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'Client' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'Client' ? 'bg-gold-600 text-white rounded-tr-none' : 'bg-white text-dark-900 border border-gray-200 rounded-tl-none font-medium'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-dark-900 placeholder:text-gray-400"
                            />
                            <button type="submit" disabled={!input.trim()} className="bg-dark-900 text-white rounded-full p-3 hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:hover:bg-dark-900 shadow-sm">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-dark-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gold-600 transition-transform duration-300 hover:scale-110 relative"
                >
                    <MessageCircle size={32} />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
