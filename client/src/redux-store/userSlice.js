import { createSlice } from "@reduxjs/toolkit";

//this is the global user state data. username initialize to empty and loggin to false.
//login and logout action change user states. these reducer actions are called by the
//useDispatch function.
export const loginSlice = createSlice({
    name: "user",
    initialState: {
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
            state.token = "";
            state.userInfo = {};
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setDisplayName: (state, action) => {
            state.userInfo.displayName = action.payload;
        },
        setImageUrl: (state, action) => {
            state.userInfo.imageUrl = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    },
});

export const { logIn, logOut, setToken, setDisplayName, setImageUrl, setUserInfo } = loginSlice.actions;
export default loginSlice.reducer;
