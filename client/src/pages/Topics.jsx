import React, { useState } from 'react';
import { toast } from "react-toastify";
import Api from '../services/axios';

const topicsList = [
    'Data Structure',
    'Javascript',
    'Python',
];

const Topics = () => {
    const [selectedTopics, setSelectedTopics] = useState([]);

    const handleTopicChange = (topic) => {
        setSelectedTopics((prevSelected) => {
            if (prevSelected.includes(topic)) {
                return prevSelected.filter(t => t !== topic);
            } else {
                return [...prevSelected, topic];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedTopics.length === 0) {
            toast.error('Please select at least one topic!');
            return;
        }
        try {
            const token = localStorage.getItem('userInfo');
            const response = await Api.post('/topics/select', { topics: selectedTopics },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            console.log('res',response)
            if (response.data.success) {
                toast.success('Topics selected successfully!');
                //  navigate
            } else if(!response.data.success) {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error Details:', error);
            toast.error('An error occurred while selecting topics');
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Topics for Your Quiz</h1>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {topicsList.map(topic => (
                            <div key={topic} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={topic}
                                    name={topic}
                                    value={topic}
                                    checked={selectedTopics.includes(topic)}
                                    onChange={() => handleTopicChange(topic)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={topic} className="ml-2 text-gray-900 dark:text-gray-300">{topic}</label>
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Topics