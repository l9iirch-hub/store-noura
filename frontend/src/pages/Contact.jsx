import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', content: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/messages', formData);
            setStatus('SUCCESS');
            setFormData({ name: '', email: '', phone: '', content: '' });
        } catch (error) {
            console.error(error);
            setStatus('ERROR');
        }
    };

    return (
        <div className="bg-white min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-serif text-dark-900 mb-4 tracking-wider">Contactez-nous</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <h3 className="text-2xl font-serif text-dark-900 mb-6">Informations</h3>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>Adresse:</strong> 123 Rue de la Mode, Casablanca, Maroc</p>
                            <p><strong>Téléphone:</strong> +212 600 000 000</p>
                            <p><strong>Email:</strong> contact@nouracouture.com</p>
                            <p><strong>Heures:</strong> Lun - Sam : 10h00 - 19h00</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
                            {status === 'SUCCESS' && <p className="text-green-600 bg-green-50 p-3 rounded">Votre message a été envoyé avec succès.</p>}
                            {status === 'ERROR' && <p className="text-red-600 bg-red-50 p-3 rounded">Une erreur est survenue.</p>}

                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Nom complet</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Email</label>
                                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Téléphone</label>
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-2">Message</label>
                                <textarea required rows="4" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full bg-white border border-gray-200 rounded px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-dark-900 text-white py-4 rounded uppercase tracking-wider hover:bg-gold-600 transition-colors duration-300">
                                Envoyer le message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
