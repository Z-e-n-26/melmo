import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryModal = ({ category = null, onClose, onSuccess }) => {
    // Initialize with safe defaults, even if props are weird
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Sync state when category changes (or on mount if category exists)
    useEffect(() => {
        if (category) {
            setName(category.name || '');
            setDescription(category.description || '');
        } else {
            setName('');
            setDescription('');
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (category) {
                await api.put(`/categories/${category.id}`, { name, description });
            } else {
                await api.post('/categories', { name, description });
            }
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (error) {
            console.error("Save error:", error);
            alert('Failed to save category');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{category ? 'Edit Category' : 'New Category'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Description</label>
                        <textarea
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold shadow-md hover:shadow-lg"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
