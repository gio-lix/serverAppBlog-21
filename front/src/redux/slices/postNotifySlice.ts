import axios from "axios";

import {createAsyncThunk, createSlice,  PayloadAction} from "@reduxjs/toolkit";

import {NotifyPostsState} from "../../typing";

const initialState = {
    status: "loaded",
    posts: [] as NotifyPostsState[],
    sound: false
}

type State = typeof initialState

export const getNotifiesApi = createAsyncThunk<NotifyPostsState[], {token: string }>(
    "post/getSavedPostApi",
    async (params) => {
        try {
            const {data} = await axios.get(`/api/notifies`, {
                headers: {
                    'Authorization': `${params.token}`
                }
            })
            return data.notifies
        } catch (err) {
            console.log(err)
        }
    }
)


const postNotifySlice = createSlice({
    name: "postNotify",
    initialState,
    reducers: {
        setPostNotify: (state: State, action: PayloadAction<NotifyPostsState>) => {
            state.posts.unshift(action.payload)
        },
        setDeletePostNotify: (state: State, action: PayloadAction<NotifyPostsState>) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload._id)
        },
        setDeleteAll: (state: State) => {
            state.posts = []
        },
        setUpdatePostNotify: (state: State, action: PayloadAction<NotifyPostsState>) => {
            let findIndex = state.posts.findIndex(item => item._id === action.payload._id)
            state.posts[findIndex].isRead = true
        },
        setSound: (state: State, action: PayloadAction<boolean>) => {
            state.sound = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotifiesApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(getNotifiesApi.fulfilled, (state: State, action: PayloadAction<NotifyPostsState[]>) => {
                state.status = "loaded"
                state.posts = action.payload
            })
    }
})


export const {
    setSound,
    setPostNotify,
    setDeletePostNotify,
    setDeleteAll,
    setUpdatePostNotify
} = postNotifySlice.actions

export const postNotifySliceReducer = postNotifySlice.reducer