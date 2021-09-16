import { createSlice } from "@reduxjs/toolkit";

//this is the global user state data. username initialize to empty and loggin to false.
//login and logout action change user states. these reducer actions are called by the
//useDispatch function.
export const loginSlice = createSlice({
    name: "user",
    initialState: {
        displayName: "",
        userInfo: {},
        isLoggedIn: false,
        token: "",
    },
    reducers: {
        logIn: (state) => {
            state.isLoggedIn = true;
        },
        logOut: (state) => {
            state.isLoggedIn = false;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setDisplayName: (state, action) => {
            state.displayName = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    },
});

export const { logIn, logOut, setToken, setDisplayName, setUserInfo} = loginSlice.actions;
export default loginSlice.reducer;
