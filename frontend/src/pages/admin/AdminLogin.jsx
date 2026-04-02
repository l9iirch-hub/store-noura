import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password });
            if (data.isAdmin) {
                localStorage.setItem('adminInfo', JSON.stringify(data));
                navigate('/admin/dashboard');
            } else {
                setError("Accès refusé. Vous n'êtes pas administrateur.");
            }
        } catch (err) {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-serif text-dark-900 tracking-wider">
                        Administration
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connectez-vous pour gérer Noura Couture
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && <div className="text-red-600 bg-red-50 p-3 rounded text-sm text-center">{error}</div>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm" placeholder="Adresse Email" />
                        </div>
                        <div>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 sm:text-sm" placeholder="Mot de Passe" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-dark-900 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors duration-300">
                            Se Connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
