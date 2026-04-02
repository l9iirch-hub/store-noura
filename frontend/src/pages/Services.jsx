import React from 'react';
import { motion } from 'framer-motion';

const Services = () => {
    const services = [
        { title: "Sur Mesure", description: "Création de caftans et djellabas sur mesure, parfaitement adaptés à votre morphologie et vos envies." },
        { title: "Prêt-à-porter", description: "Découvrez notre sélection de pièces uniques prêtes à être portées pour toutes vos occasions." },
        { title: "Retouches", description: "Service de retouches professionnelles pour ajuster vos tenues avec une précision artisanale." }
    ];

    return (
        <div className="bg-white min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-serif text-dark-900 mb-4 tracking-wider">Nos Services</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 * index }}
                            className="p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 bg-gray-50 text-center rounded relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gold-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
                            <h3 className="text-2xl font-serif text-dark-900 mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
