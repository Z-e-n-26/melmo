import React, { useState } from 'react';
import api from '../services/api';

const UsageModal = ({ product, onClose, onSuccess }) => {
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stock', {
                product_id: product.id,
                quantity: parseFloat(quantity),
                unit_type: product.unit_type,
                type: 'OUT'
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to report usage");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Report Usage: {product.name}</h3>

                <div className="bg-blue-50 p-3 rounded-lg mb-4 flex justify-between items-center text-sm text-blue-800">
                    <span className="font-medium">Current Stock:</span>
                    <span className="font-bold text-lg">{product.current_stock} {product.unit_type}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Quantity Used</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g. 5"
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
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold shadow-md hover:shadow-lg"
                        >
                            Confirm Usage
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsageModal;
