import { configureStore } from "@reduxjs/toolkit";
// Adds slices of global state to the redux store
import loginReducer from "./userSlice";
import conversationSlice from "./conversationSlice";

// global redux store. stores all reducer functions
export default configureStore({
    reducer: {
        user: loginReducer,
        conversations: conversationSlice,
    },
});
