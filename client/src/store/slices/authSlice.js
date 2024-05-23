import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { _id, name, email, image, token } = action.payload;
            state.userInfo = { _id, name, email, image };
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
            localStorage.setItem('token', token);
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
        },
    }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;