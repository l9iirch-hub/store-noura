import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-serif text-dark-900 mb-4 tracking-wider">À Propos de Noura</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="md:w-1/2 flex flex-col gap-6"
                    >
                        <img
                            src="http://localhost:5000/uploads/logo.png"
                            alt="Atelier Noura - Logo"
                            className="w-full h-auto rounded-xl object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80'; }}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="md:w-1/2 text-lg text-gray-700 leading-relaxed space-y-6"
                    >
                        <p>
                            Passionnée par la couture depuis son plus jeune âge, Noura a forgé son expérience au cœur des ateliers traditionnels marocains. Elle maîtrise l'art de la haute couture, alliant le savoir-faire ancestral aux tendances contemporaines.
                        </p>
                        <p>
                            Son objectif est de transformer les tissus luxueux en pièces maîtresses de votre garde-robe. Chaque caftan, chaque djellaba est pensé pour sublimer la silhouette tout en garantissant un confort absolu.
                        </p>
                        <p className="font-serif text-2xl text-dark-800 italic border-l-4 border-gold-500 pl-4 mt-8">
                            "La mode se démode, le style jamais."
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
