import React, { useState, useEffect } from 'react';
import Api from '../services/axios';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const token = localStorage.getItem('userInfo');
                const response = await Api.get('/leaderboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setLeaderboardData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
                setError('Failed to fetch leaderboard data');
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen mt-12">
            <Navbar />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 mt-10">
                    Leaderboard
                </h1>
                {loading ? (
                    <p className="text-center text-gray-900 dark:text-white">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-600 dark:text-red-400">{error}</p>
                ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Marks
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Topics
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                {leaderboardData.map((entry, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            #{index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {entry.userId.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {entry.marks}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {entry.topics.join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-300">
                                            {formatTime(entry.timeTaken)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
