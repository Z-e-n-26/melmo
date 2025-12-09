import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CategoryModal from '../components/CategoryModal';

const Dashboard = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    const [stats, setStats] = useState({ totalProducts: 0, lowStock: 0, totalCategories: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                api.get('/categories'),
                api.get('/products')
            ]);

            const cats = catRes.data;
            const prods = prodRes.data;

            // Calculate Stats
            const lowStockCount = prods.filter(p => {
                const threshold = (p.unit_type === 'kg' || p.unit_type === 'liter') ? 5 : 10;
                return p.current_stock < threshold;
            }).length;

            setStats({
                totalCategories: cats.length,
                totalProducts: prods.length,
                lowStock: lowStockCount
            });

            setCategories(cats);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleDelete = async (e, id) => {
        // Prevent event from bubbling up to the card (which navigates)
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm("Delete category?")) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to delete";
            alert(msg);
        }
    };

    const handleEdit = (e, cat) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedCategory(cat);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setSelectedCategory(null);
        setShowModal(true);
    };

    return (
        <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-blue-100 font-medium text-sm uppercase tracking-wider">Total Categories</h3>
                    <p className="text-4xl font-bold mt-2">{stats.totalCategories}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="text-purple-100 font-medium text-sm uppercase tracking-wider">Total Products</h3>
                    <p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
                </div>
                <div className={`rounded-xl p-6 text-white shadow-lg ${stats.lowStock > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' : 'bg-gradient-to-br from-green-500 to-green-600'}`}>
                    <h3 className="text-white/80 font-medium text-sm uppercase tracking-wider">Low Stock Alerts</h3>
                    <p className="text-4xl font-bold mt-2">{stats.lowStock}</p>
                    {stats.lowStock > 0 && <p className="text-sm mt-1 opacity-90">Requires attention!</p>}
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Browse Categories</h2>
                {isAdmin && (
                    <button
                        onClick={handleAddNew}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex items-center"
                    >
                        + New Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md group relative transform hover:-translate-y-1"
                    >
                        {/* Clickable Area for Navigation */}
                        <div
                            onClick={() => navigate(`/category/${cat.id}`)}
                            className="cursor-pointer"
                        >
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{cat.name}</h3>
                            <p className="text-gray-500 mt-2">{cat.description}</p>
                        </div>

                        {isAdmin && (
                            <div className="absolute top-4 right-4 flex space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => handleEdit(e, cat)}
                                    className="text-gray-400 hover:text-blue-600 p-1 transition-colors bg-white/80 rounded shadow-sm border border-gray-100"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, cat.id)}
                                    className="text-gray-400 hover:text-red-600 p-1 transition-colors bg-white/80 rounded shadow-sm border border-gray-100"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {categories.length === 0 && <p className="text-gray-500">No categories found.</p>}
            </div>

            {showModal && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchData}
                />
            )}
        </div>
    );
};

export default Dashboard;
