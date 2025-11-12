import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
    name:"User",
    initialState:{user:{}},
    reducers:{
        setUser:(state , action)=>{
            state.user=action.payload
        }
    }

})

export const {setUser} = UserSlice.actions;

export default UserSlice.reducer;