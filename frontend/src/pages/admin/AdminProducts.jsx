import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, UploadCloud, X } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', slug: '', price: 0, category: '', description: '', images: '', inStock: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [{ data: prods }, { data: cats }] = await Promise.all([
                axios.get('http://localhost:5000/api/products'),
                axios.get('http://localhost:5000/api/categories')
            ]);
            setProducts(prods);
            setCategories(cats);
        } catch (error) {
            console.error(error);
        }
    };

    const openAddModal = () => {
        setEditMode(false);
        setFormData({ name: '', slug: '', price: 0, category: categories[0]?._id || '', description: '', images: '', inStock: true });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditMode(true);
        setCurrentId(product._id);
        setFormData({
            name: product.name,
            slug: product.slug,
            price: product.price,
            category: product.category?._id || '',
            description: product.description,
            images: product.images ? product.images.join(', ') : '',
            inStock: product.inStock
        });
        setShowModal(true);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);
        setUploading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formDataObj, config);

            // Stocker le chemin retourné.
            const currentImages = formData.images ? formData.images.split(',').map(i => i.trim()).filter(Boolean) : [];
            currentImages.push(data); // e.g /uploads/image-12345.jpg

            setFormData({ ...formData, images: currentImages.join(', ') });
            setUploading(false);

            // Réinitialiser l'input file pour permettre d'ajouter la même image ou une autre propre
            e.target.value = null;
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert("Erreur lors de l'upload de l'image");
        }
    };

    const removeImagePreview = (indexToRemove) => {
        const currentImages = formData.images.split(',').map(i => i.trim()).filter(Boolean);
        currentImages.splice(indexToRemove, 1);
        setFormData({ ...formData, images: currentImages.join(', ') });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            const payload = {
                ...formData,
                images: formData.images.split(',').map(s => s.trim()).filter(i => i)
            };

            if (editMode) {
                await axios.put(`http://localhost:5000/api/products/${currentId}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/products', payload, config);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message;
            alert(`Erreur lors de la sauvegarde:\n${msg}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous supprimer ce produit ?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('adminInfo'));
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                fetchData();
            } catch (error) {
                console.error(error);
                const msg = error.response?.data?.message || error.message;
                alert(`Erreur de suppression:\n${msg}`);
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-dark-900">Produits</h1>
                <button onClick={openAddModal} className="bg-dark-900 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gold-600 transition-colors">
                    <Plus size={18} />
                    Nouveau Produit
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Nom</th>
                            <th className="px-6 py-4">Catégorie</th>
                            <th className="px-6 py-4">Prix</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">Aucun produit trouvé dans la boutique.</td></tr>
                        ) : products.map(product => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4">
                                    {product.images?.[0] && <img src={product.images[0]?.startsWith('/') ? `http://localhost:5000${product.images[0]}` : product.images[0]} alt="prod" className="h-12 w-12 object-cover rounded shadow-sm" />}
                                </td>
                                <td className="px-6 py-4 font-medium text-dark-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-600">{product.category?.name || '-'}</td>
                                <td className="px-6 py-4 text-gray-600">{product.price} MAD</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'En Stock' : 'Épuisé'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-3 text-gray-400">
                                    <button onClick={() => openEditModal(product)} className="hover:text-gold-600 transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(product._id)} className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h2 className="text-3xl font-serif mb-6 text-dark-900 border-b pb-4">{editMode ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}</h2>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL unique)</label>
                                    <input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (MAD)</label>
                                    <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-300 p-3 rounded bg-white focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                        <option value="" disabled>Sélectionner une catégorie</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* UPLOAD SECTION SECTION */}
                            <div className="bg-gray-50 border border-gray-200 rounded p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><UploadCloud size={18} /> Images du produit</label>

                                {/* Visualizer for existing images */}
                                {formData.images && (
                                    <div className="mb-4 flex flex-wrap gap-4">
                                        {formData.images.split(',').filter(Boolean).map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img src={img.trim().startsWith('/') ? `http://localhost:5000${img.trim()}` : img.trim()} alt="Aperçu" className="w-20 h-20 object-cover rounded shadow-sm border border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImagePreview(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                                                >
                                                    <X size={12} className="lucide-x" /> {/* Simple X text if I dont import X from lucide, let's just use Text*/}
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Uploader */}
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 relative cursor-pointer group">
                                        <div className="border border-dashed border-gray-400 bg-white p-3 rounded text-center text-sm text-gray-500 group-hover:bg-gold-50 group-hover:text-gold-700 transition-colors">
                                            {uploading ? 'Upload en cours...' : 'Cliquez pour sélectionner un fichier'}
                                        </div>
                                        <input type="file" onChange={uploadFileHandler} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">L'image sera stockée localement sur le serveur. Vous pouvez ajouter plusieurs images l'une après l'autre.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description Détaillée</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500" rows="3"></textarea>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded border border-gray-200">
                                <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({ ...formData, inStock: e.target.checked })} id="instock" className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500 focus:ring-2" />
                                <label htmlFor="instock" className="text-sm font-medium text-gray-900 cursor-pointer">Cet article est actuellement en stock ou disponible sur commande.</label>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 hover:text-dark-900 border border-gray-300 rounded font-medium transition-colors">Annuler</button>
                                <button type="submit" disabled={uploading} className="px-6 py-2 bg-dark-900 text-white rounded font-medium hover:bg-gold-600 transition-colors disabled:opacity-50">{editMode ? 'Mettre à jour' : 'Ajouter au Catalogue'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
