import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-dark-900 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1583391733958-cba84f4dc1eb?auto=format&fit=crop&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                    />
                </div>
                <div className="relative z-10 text-center px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-5xl md:text-7xl font-serif text-gold-500 mb-6 tracking-wide"
                    >
                        L'Élégance Marocaine
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-xl md:text-2xl text-gray-200 mb-10 font-light tracking-wider"
                    >
                        Style unique et raffiné, entre tradition et modernité.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <Link to="/collection" className="inline-block bg-gold-600 text-white px-8 py-3 rounded uppercase tracking-wider hover:bg-gold-500 transition-colors duration-300">
                            Découvrir la Collection
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-24 bg-white text-dark-900 text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-serif text-dark-900 mb-8 mt-4 uppercase tracking-widest relative inline-block">
                        Noura Couture
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
                        Chez Noura Couture, nous croyons en la beauté intemporelle des tenues traditionnelles marocaines (caftans, djellabas) sublimées par une touche résolument moderne. Chaque création est une pièce unique, confectionnée avec passion et précision pour révéler votre élégance.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
