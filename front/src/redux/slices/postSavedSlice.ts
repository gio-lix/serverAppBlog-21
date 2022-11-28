import axios from "axios";

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {setNotify} from "./notifySlices";
import {PostsState} from "../../typing";


const initialState = {
    status: "loaded",
    posts: [] as PostsState[] | [],
    result: 0,
    page: 2
}
type State = typeof initialState


export const getSavedPostApi = createAsyncThunk<PostsState[], {token: any }>(
    "post/getSavedPostApi",
    async (params, {dispatch}) => {
        try {
            const {data} = await axios.get(`/api/getSavedPost`, {
                headers: {
                    'Authorization': `${params.token}`
                }
            })
            return data
        } catch (err) {
            return dispatch(setNotify({error: [(err as any).response.data]}))
        }
    }
)

const postSavedSlice = createSlice({
    name: "savedPost",
    initialState,
    reducers: {
        setAddSavedPosts: (state: State, action: PayloadAction<{posts:PostsState[], result: number}>) => {
            state.posts = [...state.posts, ...action.payload.posts]
            state.result = state.result + action.payload.result
            state.page = state.page + 1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSavedPostApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(getSavedPostApi.fulfilled, (state: State, action: PayloadAction<any>) => {
                state.status = "loaded"
                state.posts = action.payload.savedPosts
                state.result = action.payload.result
                state.page = 2
            })
    }
})
export const {setAddSavedPosts} = postSavedSlice.actions
export const savedPostsReducer = postSavedSlice.reducer

