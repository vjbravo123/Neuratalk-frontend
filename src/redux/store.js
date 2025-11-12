import {configureStore} from "@reduxjs/toolkit";
import UserSliceReducer from "./UserSlice.js"
const store = configureStore({
    reducer:UserSliceReducer
})

export default store;