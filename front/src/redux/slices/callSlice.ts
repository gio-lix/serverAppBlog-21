import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    call: null as any,
    peer: null as any
}

type State = typeof initialState


const callSlice = createSlice({
    name: "call",
    initialState,
    reducers: {
        setCall: (state: State, {payload}) => {
            state.call = payload
        },
        setCallEnd: (state: State) =>  {
            state.call = null
        },
        setPeer: (state: State, {payload}) => {
            state.peer = payload
        }
    }
})

export const {setCall, setCallEnd, setPeer} = callSlice.actions

export const callReducer = callSlice.reducer