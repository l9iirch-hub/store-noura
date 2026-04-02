import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('noura_cart');
        return localData ? JSON.parse(localData) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('noura_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.product === product._id);
            if (exists) {
                return prev.map(item => item.product === product._id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, {
                product: product._id,
                name: product.name,
                image: product.images?.[0] || '',
                price: product.price,
                qty: 1
            }];
        });
        setIsCartOpen(true); // Ouvre le panier visuellement
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.product !== id));
    };

    const updateQty = (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            removeFromCart(id);
            return;
        }
        setCartItems(prev => prev.map(item => item.product === id ? { ...item, qty: newQty } : item));
    }

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, isCartOpen, setIsCartOpen, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
