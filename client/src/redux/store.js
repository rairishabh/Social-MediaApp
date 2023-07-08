import { configureStore } from "@reduxjs/toolkit"
import appConfigReducer from "./slices/appConfigSlice";
import postReducer from "./slices/postSlice"

export default configureStore({
    reducer: {
        appConfigReducer,
        postReducer
    }
})