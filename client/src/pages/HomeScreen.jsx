import React from 'react'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome to QuizMaster
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Please log in to take a quiz and test your knowledge.
      </p>
      <Link
        to="/users/login"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Login
      </Link>
    </div>
  </section>
  )
}

export default HomeScreen