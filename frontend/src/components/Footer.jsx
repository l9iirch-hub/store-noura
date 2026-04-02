import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-dark-800 text-gray-400 py-10 text-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0 text-left">
                    <span className="text-2xl font-serif font-bold text-gold-500 tracking-widest">NOURA CC</span>
                    <p className="text-sm mt-1 text-gray-500">Style unique et raffiné.</p>
                </div>

                <div className="flex space-x-6 text-sm">
                    <Link to="/" className="hover:text-white transition-colors duration-300">Accueil</Link>
                    <Link to="/collection" className="hover:text-white transition-colors duration-300">Collection</Link>
                    <Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
                    <Link to="/admin" className="hover:text-gold-500 transition-colors duration-300 underline">Admin</Link>
                </div>

                <div className="mt-4 md:mt-0 text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Noura Couture. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
