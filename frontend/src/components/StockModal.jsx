import React, { useState } from 'react';
import api from '../services/api';

const StockModal = ({ product, onClose, onSuccess }) => {
    const [quantity, setQuantity] = useState('');
    const [unitType, setUnitType] = useState(product.unit_type);
    const [type, setType] = useState('IN');

    const user = JSON.parse(localStorage.getItem('user'));
    const canOut = user.role === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stock', {
                product_id: product.id,
                quantity: parseFloat(quantity),
                unit_type: unitType,
                type: type
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to update stock");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-2xl transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Update Stock: {product.name}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Type</label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                type="button"
                                className={`flex-1 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${type === 'IN' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                onClick={() => setType('IN')}
                            >
                                IN (+)
                            </button>
                            {canOut && (
                                <button
                                    type="button"
                                    className={`flex-1 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${type === 'OUT' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    onClick={() => setType('OUT')}
                                >
                                    OUT (-)
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Unit</label>
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
                            Update Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModal;
