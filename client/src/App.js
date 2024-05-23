import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Quiz Application</h1>
        <p className="mb-4">Welcome to the quiz app!</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default App;
