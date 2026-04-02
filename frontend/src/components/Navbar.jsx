import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { cartItems, setIsCartOpen } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="bg-dark-900 border-b border-dark-800 text-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-serif font-bold text-gold-500 tracking-wider">
                            NOURA COUTURE
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className="hover:text-gold-500 transition-colors duration-300">Accueil</Link>
                        <Link to="/about" className="hover:text-gold-500 transition-colors duration-300">À Propos</Link>
                        <Link to="/collection" className="hover:text-gold-500 transition-colors duration-300">Collection</Link>
                        <Link to="/services" className="hover:text-gold-500 transition-colors duration-300">Services</Link>
                        <Link to="/contact" className="hover:text-gold-500 transition-colors duration-300">Contact</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-gold-500 transition-colors p-2">
                            <ShoppingBag size={24} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-gold-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gold-500 hover:text-white p-2">
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-dark-800 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-b border-dark-700">
                        <Link to="/" className="block px-3 py-2 text-base font-medium hover:text-gold-500" onClick={() => setIsOpen(false)}>Accueil</Link>
                        <Link to="/about" className="block px-3 py-2 text-base font-medium hover:text-gold-500" onClick={() => setIsOpen(false)}>À Propos</Link>
                        <Link to="/collection" className="block px-3 py-2 text-base font-medium hover:text-gold-500" onClick={() => setIsOpen(false)}>Collection</Link>
                        <Link to="/services" className="block px-3 py-2 text-base font-medium hover:text-gold-500" onClick={() => setIsOpen(false)}>Services</Link>
                        <Link to="/contact" className="block px-3 py-2 text-base font-medium hover:text-gold-500" onClick={() => setIsOpen(false)}>Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
