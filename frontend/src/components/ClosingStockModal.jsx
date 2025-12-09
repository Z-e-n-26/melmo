import React, { useState } from 'react';
import api from '../services/api';

const ClosingStockModal = ({ product, onClose, onSuccess }) => {
    const [closingStock, setClosingStock] = useState(product.closing_stock || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${product.id}/closing-stock`, {
                closing_stock: parseFloat(closingStock)
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Failed to update closing stock");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-xl transform transition-all scale-100">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Set Closing Stock: {product.name}</h3>

                <div className="bg-blue-50 p-3 rounded-lg mb-4 flex justify-between items-center text-sm text-blue-800">
                    <span className="font-medium">Current System Stock:</span>
                    <span className="font-bold text-lg">{product.current_stock} {product.unit_type}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Closing Stock Quantity</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={closingStock}
                            onChange={(e) => setClosingStock(e.target.value)}
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
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 font-bold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                            Save Closing Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClosingStockModal;
