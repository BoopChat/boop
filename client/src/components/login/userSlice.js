import { createSlice } from "@reduxjs/toolkit";

//this is the global user state data. username initialize to empty and loggin to false.
//login and logout action change user states. these reducer actions are called by the useDispatch function.
export const loginSlice = createSlice({
  name: "user",
  initialState: {
    userName: "",
    isLoggedIn: false,
  },
  reducers: {
    logIn: (state) => {
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { logIn, logOut } = loginSlice.actions;
export default loginSlice.reducer;
