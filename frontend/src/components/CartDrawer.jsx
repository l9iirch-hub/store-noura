import React, { useState } from 'react';
import axios from 'axios';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config/api';

const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, updateQty, removeFromCart, clearCart } = useCart();

    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const getImageUrl = (img) => {
        if (!img) return 'https://via.placeholder.com/100?text=Image';
        const url = img.trim();
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `${API_URL}${url}`;
        return `${API_URL}/${url}`;
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const submitOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/orders`, {
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                orderItems: cartItems,
                totalPrice: totalPrice,
                notes: "Acheté via le store"
            });
            setSuccess(true);
            clearCart();
            setFormData({ name: '', email: '', phone: '' });
            setTimeout(() => {
                setSuccess(false);
                setIsCartOpen(false);
            }, 3000);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la validation de la commande.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-serif text-dark-900 flex items-center gap-3">
                                <ShoppingBag className="text-gold-600" />
                                Mon Panier
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-white rounded-full text-gray-500 hover:text-dark-900 shadow-sm transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {success ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-serif mb-2">Commande confirmée !</h3>
                                <p className="text-gray-500">Merci pour votre confiance. Nous vous contacterons très vite pour la livraison.</p>
                            </div>
                        ) : cartItems.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                                <ShoppingBag size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-serif">Votre panier est vide</p>
                                <button onClick={() => setIsCartOpen(false)} className="mt-6 px-6 py-2 border border-gold-600 text-gold-600 rounded-full hover:bg-gold-50 transition-colors">
                                    Découvrir la collection
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {cartItems.map(item => (
                                        <div key={item.product} className="flex gap-4 border-b border-gray-50 pb-6">
                                            <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-24 object-cover rounded-md shadow-sm" />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-dark-900 leading-tight pr-4">{item.name}</h4>
                                                    <button onClick={() => removeFromCart(item.product)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="text-gold-600 font-bold text-sm">{item.price > 0 ? item.price + ' MAD' : 'Sur devis'}</div>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center border border-gray-200 rounded bg-gray-50">
                                                        <button onClick={() => updateQty(item.product, item.qty, -1)} className="p-1 text-gray-500 hover:text-dark-900"><Minus size={14} /></button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                                                        <button onClick={() => updateQty(item.product, item.qty, 1)} className="p-1 text-gray-500 hover:text-dark-900"><Plus size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Checkout form */}
                                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mt-8">
                                        <h3 className="font-medium text-dark-900 mb-4 border-b border-gray-200 pb-2">Détails de livraison</h3>
                                        <form id="checkout-form" onSubmit={submitOrder} className="space-y-4">
                                            <div>
                                                <input required type="text" placeholder="Nom complet" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full text-sm p-3 rounded border border-gray-200 focus:ring-1 focus:ring-gold-500 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <input required type="text" placeholder="Numéro de téléphone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full text-sm p-3 rounded border border-gray-200 focus:ring-1 focus:ring-gold-500 focus:outline-none bg-white" />
                                            </div>
                                            <div>
                                                <input type="email" placeholder="Email (optionnel)" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full text-sm p-3 rounded border border-gray-200 focus:ring-1 focus:ring-gold-500 focus:outline-none bg-white" />
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-gray-500 font-medium">Total</span>
                                        <span className="text-3xl font-serif text-dark-900 font-bold">{totalPrice} <span className="text-lg text-gold-600">MAD</span></span>
                                    </div>
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={loading}
                                        className="w-full bg-dark-900 text-white py-4 rounded-full font-medium tracking-wide hover:bg-gold-600 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Confirmer la Commande'}
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
