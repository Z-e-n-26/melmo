import React, { useState } from 'react';
import api from '../services/api';

const ProductModal = ({ product, categoryId, onClose, onSuccess }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [unitType, setUnitType] = useState(product ? product.unit_type : 'kg');
    const [openingStock, setOpeningStock] = useState(product ? product.opening_stock : 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product) {
                await api.put(`/products/${product.id}`, { name, unit_type: unitType, opening_stock: openingStock });
            } else {
                await api.post('/products', {
                    name,
                    category_id: categoryId,
                    unit_type: unitType,
                    opening_stock: parseFloat(openingStock)
                });
            }
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to save product");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-xl transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{product ? 'Edit Product' : 'New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Unit Type</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={unitType}
                            onChange={(e) => setUnitType(e.target.value)}
                        >
                            <option value="kg">kg</option>
                            <option value="gram">gram</option>
                            <option value="litre">litre</option>
                            <option value="ml">ml</option>
                            <option value="unit">unit</option>
                            <option value="piece">piece</option>
                            <option value="packet">packet</option>
                        </select>
                    </div>
                    {!product && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">Opening Stock</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={openingStock}
                                onChange={(e) => setOpeningStock(e.target.value)}
                            />
                        </div>
                    )}

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
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
