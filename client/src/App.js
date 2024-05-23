import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/users/*' element={<UserRoutes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
