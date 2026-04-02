import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('http://localhost:5000/api/categories', formData, config);
            setShowModal(false);
            setFormData({ name: '', slug: '', description: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création de la catégorie. Assurez-vous que le slug (URL) est unique.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous supprimer cette catégorie ? Note: Cela cassera les produits liés si vous ne les modifiez pas.')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
                fetchData();
            } catch (error) {
                console.error(error);
                alert('Erreur de suppression.');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-dark-900">Catégories</h1>
                <button onClick={() => setShowModal(true)} className="bg-dark-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gold-600 transition-colors">
                    <Plus size={18} />
                    Nouvelle Catégorie
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Nom</th>
                            <th className="px-6 py-4">Slug</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucune catégorie trouvée.</td></tr>
                        ) : categories.map(cat => (
                            <tr key={cat._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 font-medium text-dark-900">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{cat.description}</td>
                                <td className="px-6 py-4 flex justify-end gap-3 text-gray-400">
                                    <button onClick={() => handleDelete(cat._id)} className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-serif mb-6 border-b pb-4">Ajouter une Catégorie</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Nom</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gold-500" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Slug (URL propre)</label>
                                <input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gold-500" placeholder="ex: mon-slug" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-gold-500" rows="3"></textarea>
                            </div>
                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-dark-900 font-medium">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-dark-900 text-white rounded hover:bg-gold-600 font-medium transition-colors">Créer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
