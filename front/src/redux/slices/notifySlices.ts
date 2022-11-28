import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState = {
    theme: localStorage.getItem("blog_theme") || "light",
    status: "loaded",
    notify: {
        success: [],
        error: [],
    },
    online: [] as any
}

type State = typeof initialState

const notifySlices = createSlice({
    name: "notify",
    initialState,
    reducers: {
        setNotify: (state: State, action: PayloadAction<any>) => {
            const {success, error} = action.payload
            state.notify.success = success
            state.notify.error = error
            state.status = "loaded"
        },
        setNotifyReset: (state: State) => {
            state.notify.success = []
            state.notify.error = []
            state.status = "loaded"
        },
        setTheme: (state: State, action: PayloadAction<any>) => {
            state.theme = action.payload
        },
        setOnline: (state: State, action: PayloadAction<any>) => {
            if (state.online.includes(action.payload)) return
            state.online.push(action.payload)
        },
        setOffline: (state: State, {payload}: PayloadAction<any>) => {
            state.online = state.online.filter((e: any) => e._id !== payload)
        }
    }
})

export const {
    setNotify,
    setNotifyReset,
    setTheme,
    setOnline,
    setOffline
} = notifySlices.actions

export const notifyReducer = notifySlices.reducer