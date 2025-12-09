import React, { useEffect, useState } from 'react';
import api from '../services/api';

const WeeklyHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-4 text-gray-500">Loading history...</div>;
    if (!history.length) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Weekly Stock History</h2>
            <div className="space-y-6">
                {history.map((weekItem) => (
                    <div key={weekItem.week} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Week: {weekItem.week}</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(weekItem.units).map(([unit, data]) => (
                                    <div key={unit} className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{unit}</span>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Added:</span>
                                                <span className="font-medium text-green-600">+{data.added}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Cleared:</span>
                                                <span className="font-medium text-red-600">-{data.cleared}</span>
                                            </div>
                                            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-base font-bold">
                                                <span className="text-gray-800">End Balance:</span>
                                                <span className="text-blue-600">{data.endBalance}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyHistory;
