import React, { useEffect, useState, useCallback } from 'react';
import Api from '../services/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(240);
    const [timerExpired, setTimerExpired] = useState(false);
    const navigate = useNavigate();
    const query = useQuery();
    const selectedTopics = query.getAll('topics');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeLeft > 0) {
                setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
            } else {
                setTimerExpired(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    const fetchRandomQuestion = useCallback(async () => {
        try {
            const topicsQueryParam = selectedTopics.map(topic => `topics=${encodeURIComponent(topic)}`).join('&');
            const response = await Api.get(`/quiz?${topicsQueryParam}`);
            if (response?.data.success) {
                setQuestions(response.data.data);
            } else if (!response.data.success) {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    }, [selectedTopics]);

    useEffect(() => {
        fetchRandomQuestion();
    }, []); // Run only once when the component mounts

    const handleAnswerChange = (questionId, answer) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answer,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userInfo');
            const timeTaken = 240 - timeLeft;
            const response = await Api.post('/result', { selectedAnswers, timeTaken, selectedTopics }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if (response.data.success) {
                toast.success('Successfully submitted...');
                navigate('/score');
            } else if (!response.data.success) {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRetakeQuiz = () => {
        navigate('/topics');
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="p-8 rounded-md bg-gray-800 shadow-lg m-20">
                    {timerExpired ? (
                        <div className="text-center">
                            <p className="text-xl mb-4">Time is up! You can retake the quiz.</p>
                            <button
                                type="button"
                                onClick={handleRetakeQuiz}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    ) : (
                        <>
                            {questions.length > 0 ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-between mb-4">
                                        <h3 className="text-lg font-bold">
                                            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                        </h3>
                                    </div>
                                    {questions.map((question, index) => (
                                        <div key={question._id} className="mb-6">
                                            <h2 className="text-2xl mb-4">{index + 1}. {question.question}</h2>
                                            <ul className="list-disc pl-5">
                                                {question.options.map((option, i) => (
                                                    <li key={i} className="mb-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name={`question-${question._id}`}
                                                                value={option}
                                                                onChange={() => handleAnswerChange(question._id, option)}
                                                                className="mr-2"
                                                            />
                                                            {option}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <button
                                        type="submit"
                                        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                                    >
                                        Submit
                                    </button>
                                </form>
                            ) : (
                                <p>Loading questions...</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
