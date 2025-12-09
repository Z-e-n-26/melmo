import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ChevronRight, ArrowLeft, Calendar, Package, Layers } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navigation State
    const [view, setView] = useState('months'); // months, weeks, categories, products
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/stock/history');
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Helper to find data for a static month button
    const getMonthData = (monthName) => {
        return history.find(h => h.month.includes(monthName) || h.month.includes(monthName.substring(0, 3)));
    };

    const handleMonthClick = (monthName) => {
        const data = getMonthData(monthName);
        if (data) {
            setSelectedMonth(data);
            setView('weeks');
        } else {
            // Optional: Handle empty months (shake effect or alert)
            // For now, doing nothing or maybe creating a placeholder "No Data" view if user insists
            alert(`No history data for ${monthName}`);
        }
    };

    const handleWeekClick = (weekData) => {
        setSelectedWeek(weekData);
        setView('categories');
    };

    const handleCategoryClick = (catData) => {
        setSelectedCategory(catData);
        setView('products');
    };

    const handleBack = () => {
        if (view === 'products') setView('categories');
        else if (view === 'categories') setView('weeks');
        else if (view === 'weeks') setView('months');
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="flex items-center space-x-4 mb-8">
                {view !== 'months' && (
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="text-3xl font-bold text-gray-800">
                    {view === 'months' && 'Select Month'}
                    {view === 'weeks' && `${selectedMonth?.month} - Select Week`}
                    {view === 'categories' && `${selectedWeek?.week} - Select Category`}
                    {view === 'products' && `${selectedCategory?.name} Products`}
                </h1>
            </div>

            {/* View 1: Month Grid */}
            {view === 'months' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {monthNames.map((month) => {
                        const hasData = getMonthData(month);
                        return (
                            <button
                                key={month}
                                onClick={() => handleMonthClick(month)}
                                className={`
                                    p-8 rounded-2xl text-xl font-bold flex flex-col items-center justify-center space-y-4 transition-all duration-300
                                    ${hasData
                                        ? 'bg-white text-blue-600 shadow-md hover:shadow-xl hover:scale-105 border border-blue-100 cursor-pointer'
                                        : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed grayscale'
                                    }
                                `}
                            >
                                <Calendar size={32} className={hasData ? 'text-blue-500' : 'text-gray-300'} />
                                <span>{month}</span>
                                {hasData && <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* View 2: Weeks Grid */}
            {view === 'weeks' && selectedMonth && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedMonth.weeks.map((week, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleWeekClick(week)}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col items-center justify-center space-y-3"
                        >
                            <Calendar size={32} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-gray-800">{week.week}</h3>
                            <span className="text-sm text-gray-500">{week.categories.length} Categories</span>
                        </button>
                    ))}
                </div>
            )}

            {/* View 3: Categories Grid */}
            {view === 'categories' && selectedWeek && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedWeek.categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleCategoryClick(cat)}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col items-center justify-center space-y-3"
                        >
                            <Layers size={32} className="text-purple-500 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                            <span className="text-sm text-gray-500">{cat.products.length} Products</span>
                        </button>
                    ))}
                </div>
            )}

            {/* View 4: Product Table */}
            {view === 'products' && selectedCategory && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Package className="mr-2" />
                            {selectedCategory.name} Stock
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold text-center text-green-600">Added</th>
                                    <th className="px-6 py-4 font-semibold text-center text-red-600">Cleared</th>
                                    <th className="px-6 py-4 font-bold text-right text-gray-800">End Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {selectedCategory.products.map((prod, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{prod.name}</td>
                                        <td className="px-6 py-4 text-sm text-center font-medium text-green-600">
                                            {prod.added > 0 ? `+${prod.added}` : '-'} <span className="text-xs text-gray-400 font-normal">{prod.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center font-medium text-red-600">
                                            {prod.cleared > 0 ? `-${prod.cleared}` : '-'} <span className="text-xs text-gray-400 font-normal">{prod.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-blue-700">
                                            {prod.endBalance} <span className="text-xs text-gray-400 font-normal">{prod.unit}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
