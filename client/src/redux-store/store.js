import { configureStore } from "@reduxjs/toolkit";
//adds user slice state to the global store
import loginReducer from "../components/login/userSlice";

// global redux store. stores all reducer functions
export default configureStore({
  reducer: {
    user: loginReducer,
  },
});
