import React, { useEffect, useState } from 'react';
import Api from '../services/axios';
import Navbar from '../components/Navbar';

const ScorePage = () => {
    const [scorecards, setScorecards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScorecards = async () => {
            try {
                const token = localStorage.getItem('userInfo');
                const response = await Api.get('/scorecards', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (Array.isArray(response.data.data)) {
                    setScorecards(response.data.data);
                } else {
                    throw new Error('Invalid response format');
                }
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch scorecards');
                setLoading(false);
            }
        };

        fetchScorecards();
    }, []);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-4xl p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Your Scorecards
                    </h1>
                    {loading ? (
                        <p className="text-center text-gray-900 dark:text-white">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
                    ) : scorecards.length === 0 ? (
                        <p className="text-center text-gray-900 dark:text-white">No scorecards found.</p>
                    ) : (
                        <div className="space-y-6">
                            {scorecards
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((scorecard, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                Date: {new Date(scorecard.createdAt).toLocaleDateString()}
                                            </h2>
                                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                Score: {scorecard.marks}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                Topics:
                                            </h3>
                                            <ul className="list-disc list-inside">
                                                {scorecard.topics && scorecard.topics.map((topic, index) => (
                                                    <li key={index} className="text-gray-700 dark:text-gray-300">
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}

                        </div>

                    )}
                </div>
            </div>
        </div>
    );
};

export default ScorePage;