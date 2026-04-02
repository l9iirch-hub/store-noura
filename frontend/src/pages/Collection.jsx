import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

const Collection = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const { addToCart } = useCart();

    const getImageUrl = (img) => {
        if (!img) return null;
        const url = img.trim();
        if (url.startsWith('http')) return url;
        if (url.startsWith('/')) return `http://localhost:5000${url}`;
        return `http://localhost:5000/${url}`;
    };

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data: cats } = await axios.get('http://localhost:5000/api/categories');
                setCategories(cats);
                const { data: prods } = await axios.get('http://localhost:5000/api/products');
                setProducts(prods);
            } catch (error) {
                console.error("API Error, loading fallback data", error);
                setCategories([{ name: 'Caftan', _id: '1' }, { name: 'Djellaba', _id: '2' }]);
                setProducts([
                    { _id: '101', name: 'Leila Royal Caftan', price: 1200, category: { name: 'Caftan' }, images: ['https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=500&q=80'] },
                    { _id: '102', name: 'Noor Djellaba', price: 800, category: { name: 'Djellaba' }, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80'] },
                    { _id: '103', name: 'Amira Bridal Collection', price: 0, category: { name: 'Caftan' }, images: ['https://images.unsplash.com/photo-1515378960530-7c0da622941f?w=500&q=80'] }
                ]);
            }
        };
        fetchContent();
    }, []);

    const filteredProducts = activeFilter === 'All'
        ? products
        : products.filter(p => p.category?.name === activeFilter);

    return (
        <div className="bg-gray-50 min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-serif text-dark-900 mb-4 tracking-wider">Notre Collection</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveFilter('All')}
                        className={`px-6 py-2 rounded-full uppercase tracking-wider text-sm transition-colors duration-300 ${activeFilter === 'All' ? 'bg-gold-600 text-white' : 'bg-white text-dark-900 border border-gray-200 hover:border-gold-500'}`}
                    >
                        Tous
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveFilter(cat.name)}
                            className={`px-6 py-2 rounded-full uppercase tracking-wider text-sm transition-colors duration-300 ${activeFilter === cat.name ? 'bg-gold-600 text-white' : 'bg-white text-dark-900 border border-gray-200 hover:border-gold-500'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden bg-gray-100 shadow-xl rounded-lg h-[450px] flex justify-center items-center">
                                {getImageUrl(product.images?.[0]) ? (
                                    <img
                                        src={getImageUrl(product.images[0])}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&q=80'; }}
                                    />
                                ) : (
                                    <span className="text-gray-400 font-serif text-lg italic">Sans image</span>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="text-xl font-serif text-dark-900">{product.name}</h3>
                                <p className="text-gold-600 font-semibold mt-2">{product.price > 0 ? product.price + ' MAD' : 'Sur Commande'}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                    className="mt-4 w-full bg-dark-900 border border-dark-900 text-white py-2.5 rounded-full font-medium hover:bg-gold-600 hover:border-gold-600 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Ajouter au Panier
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collection;
