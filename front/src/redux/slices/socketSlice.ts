import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    socket: [] as any
}
type State = typeof initialState

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state: State ,{payload}: any) => {
           state.socket = payload.socket
        }
    }
})

export const {setSocket} = socketSlice.actions

export const socketReducer = socketSlice.reducer