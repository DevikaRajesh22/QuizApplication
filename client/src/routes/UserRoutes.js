import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomeScreen from '../pages/HomeScreen';
import Topics from '../pages/Topics';
import QuizPage from '../pages/QuizPage';
import ScorePage from '../pages/ScorePage';
import Leaderboard from '../pages/Leaderboard';
import UserLoggedIn from '../components/userLoggedIn';
import UserLoggedOut from '../components/userLoggedOut';

function UserRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='' element={<UserLoggedOut />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignupPage />} />
            </Route>
            <Route path='' element={<UserLoggedIn />}>
                <Route path='/topics' element={<Topics />} />
                <Route path='/quiz' element={<QuizPage />} />
                <Route path='/score' element={<ScorePage />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
            </Route>
        </Routes>
    )
}

export default UserRoutes;