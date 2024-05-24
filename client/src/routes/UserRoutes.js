import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomeScreen from '../pages/HomeScreen';
import Topics from '../pages/Topics';

function UserRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomeScreen/>}/>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/topics' element={<Topics />} />
        </Routes>
    )
}

export default UserRoutes;