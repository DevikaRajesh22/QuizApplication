import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const UserLoggedOut = () => {
    const userInfo = useSelector((state) => state.auth);
    return (
        userInfo.userInfo ? <Navigate to='/users/topics' /> : <Outlet />
    )
}

export default UserLoggedOut