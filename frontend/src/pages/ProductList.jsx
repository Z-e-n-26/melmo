import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, ArrowLeft, Edit } from 'lucide-react';
import StockModal from '../components/StockModal';
import ProductModal from '../components/ProductModal';
import UsageModal from '../components/UsageModal';

const ProductList = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    // Modals
    const [showStockModal, setShowStockModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showUsageModal, setShowUsageModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products?category_id=${categoryId}`);
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Failed to delete product");
        }
    };

    const handleAddStock = (product) => {
        setSelectedProduct(product);
        setShowStockModal(true);
    };

    const handleReportUsage = (product) => {
        setSelectedProduct(product);
        setShowUsageModal(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const handleNewProduct = () => {
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    return (
        <div>
            <button onClick={() => navigate('/')} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Products</h2>
                {isAdmin && (
                    <button onClick={handleNewProduct} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95">
                        <Plus size={20} className="mr-2" /> New Product
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider font-semibold">
                            <tr>
                                <th className="p-4 border-b border-gray-100">Name</th>
                                <th className="p-4 border-b border-gray-100">Unit</th>
                                <th className="p-4 text-center border-b border-gray-100">Added Stock</th>
                                <th className="p-4 text-center border-b border-gray-100">Used Stock</th>
                                <th className="p-4 text-center border-b border-gray-100">Current</th>
                                <th className="p-4 text-center border-b border-gray-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => {
                                const isLowStock = product.current_stock < (['kg', 'liter'].includes(product.unit_type) ? 5 : 10);
                                return (
                                    <tr key={product.id} className={`transition-colors ${isLowStock ? 'bg-red-50 hover:bg-red-100 border-l-4 border-red-500' : 'hover:bg-gray-50'}`}>
                                        <td className="p-4 font-medium text-gray-900 flex items-center whitespace-nowrap">
                                            {product.name}
                                            {isLowStock && (
                                                <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">LOW</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">{product.unit_type}</td>
                                        <td className="p-4 text-center text-gray-500 font-medium">{product.total_added || 0}</td>
                                        <td className="p-4 text-center text-gray-500 font-medium">{product.total_used || 0}</td>
                                        <td className={`p-4 text-center text-xl font-bold ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>{product.current_stock}</td>
                                        <td className="p-4 flex justify-center space-x-2 items-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleAddStock(product)}
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                                                title="Add Stock"
                                            >
                                                Add Stock
                                            </button>
                                            <button
                                                onClick={() => handleReportUsage(product)}
                                                className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
                                                title="Report Usage"
                                            >
                                                Report Usage
                                            </button>
                                            {isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="text-gray-400 hover:text-blue-600 p-2 transition-colors transform hover:scale-110"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="text-red-400 hover:text-red-600 p-2 transition-colors transform hover:scale-110"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No products found in this category.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showStockModal && selectedProduct && (
                <StockModal
                    product={selectedProduct}
                    onClose={() => setShowStockModal(false)}
                    onSuccess={() => {
                        fetchProducts();
                    }}
                />
            )}

            {showProductModal && (
                <ProductModal
                    product={selectedProduct}
                    categoryId={categoryId}
                    onClose={() => setShowProductModal(false)}
                    onSuccess={fetchProducts}
                />
            )}

            {showUsageModal && selectedProduct && (
                <UsageModal
                    product={selectedProduct}
                    onClose={() => setShowUsageModal(false)}
                    onSuccess={fetchProducts}
                />
            )}
        </div>
    );
};

export default ProductList;
