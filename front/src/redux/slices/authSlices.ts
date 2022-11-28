import axios from "axios";

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setNotify} from "./notifySlices";
import {PostsState, UpdateUserState, UserState} from "../../typing";

interface User extends UserState {
    saved: string[]
}

interface ProfilePostPayload {
    post: PostsState[]
    result: number
    page: number
    _id: string
}

const initialState = {
    status: "loaded",
    user: {} as User,
    users: [] as UserState[],
    profilePosts: {
        posts: [] as PostsState[],
        result: 0 as number,
        page: 2,
        _id: ""
    },
    profile: {} as UserState,
    ids: [] as any | [],
    token: null as string | null
}
type State = typeof initialState

export const postDataApi = createAsyncThunk<Object, any>(
    "auth/fetchUserData",
    async (params, {dispatch}) => {
        try {
            const {data} = await axios.post("/api/login", params)
            localStorage.setItem("blog_access_token", data.access_token)
            dispatch(setNotify({success: [{msg: data.msg}]}))
            return data
        } catch (err) {
            return err
        }
    })
export const refreshDataApi = createAsyncThunk(
    "auth/refreshDataApi",
    async (_, thunkAPI) => {
        try {
            const {data} = await axios.post("/api/refresh_token")
            return data
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    })
export const postRegisterDataApi = createAsyncThunk<{ user: User, access_token: string }, any>(
    "auth/postRegisterDataApi",
    async (params, thunkAPI) => {
        try {
            const {data} = await axios.post("/api/register", params)
            localStorage.setItem("blog_access_token", data.access_token)
            return data
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    })

export const postProfileDataApi = createAsyncThunk<{ user: UserState }, any>(
    "auth/postProfileDataApi",
    async (params, thunkAPI) => {
        const {id, token} = params

        try {
            const {data} = await axios.get(`/api/user/${id}`, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            return data
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    })

export const postProfilePosts = createAsyncThunk<{ post: PostsState[], result: number }, any>(
    "auth/postProfilePosts",
    async (params, thunkAPI) => {
        const {id, token} = params

        try {
            const {data} = await axios.get(`/api/user_post/${id}`, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            return data
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    })

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setFollowers: (state: State, action: PayloadAction<UserState>) => {
            state.profile = action.payload
        },
        setFollowing: (state: State, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        setProfileUsers: (state: State, action: PayloadAction<UserState>) => {
            state.ids.push(action.payload._id)
            state.users.push(action.payload)
        },
        setProfilePosts: (state: State, action: PayloadAction<ProfilePostPayload>) => {
            state.profilePosts.posts = [...state.profilePosts.posts, ...action.payload.post]
            state.profilePosts.result = state.profilePosts.result + action.payload.result
            state.profilePosts.page = state.profilePosts.page + 1
        },
        setUpdateUser: (state: State, action: PayloadAction<{ user: UpdateUserState }>) => {
            state.user = {...state.user, ...action.payload.user}
        },

        setSavePosts: (state: State, action: PayloadAction<{ postId: string }>) => {
            if (state.user.saved) {
                state.user.saved = [...state.user.saved, action.payload.postId]
            } else {
                state.user.saved = [action.payload.postId]
            }
        },
        setRemovePosts: (state: State, action: PayloadAction<{ postId: string }>) => {
            state.user.saved = state.user.saved.filter(e => e !== action.payload.postId)
        },
        setProfilePostsPosts: (state: State, action: PayloadAction<{ post: PostsState[], result: number }>) => {
            state.profilePosts.page = 2
            state.profilePosts.posts = action.payload.post
            state.profilePosts.result = action.payload.result
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(postDataApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(postDataApi.fulfilled, (state: State, {payload}: any) => {

                state.token = payload.access_token
                state.user = payload.user
                state.status = "loaded"
            })
            .addCase(postDataApi.rejected, (state: State) => {
                state.status = "loaded"
            })

            .addCase(refreshDataApi.fulfilled, (state: State, action: PayloadAction<{ user: User, access_token: string }>) => {
                state.token = action.payload.access_token
                state.user = action.payload.user
            })

            //   register
            .addCase(postRegisterDataApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(postRegisterDataApi.fulfilled, (state: State, action: PayloadAction<{ user: User, access_token: string }>) => {
                state.token = action.payload.access_token
                state.user = action.payload.user
                state.status = "loaded"
            })
            .addCase(postRegisterDataApi.rejected, (state: State) => {
                state.status = "loaded"
            })

            //   profile
            .addCase(postProfileDataApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(postProfileDataApi.fulfilled, (state: State, action: PayloadAction<{ user: UserState }>) => {
                state.profile = action.payload.user
                state.status = "loaded"
            })
            .addCase(postProfileDataApi.rejected, (state: State) => {
                state.status = "loaded"
            })


            .addCase(postProfilePosts.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(postProfilePosts.fulfilled, (state: State, action: PayloadAction<{ post: PostsState[], result: number }>) => {
                state.status = "loaded"
                state.profilePosts.posts = action.payload.post
                state.profilePosts.result = action.payload.result
                state.profilePosts.page = 2
            })
    }
});


export const {
    setFollowers,
    setProfilePostsPosts,
    setFollowing,
    setProfileUsers,
    setUpdateUser,
    setProfilePosts,
    setSavePosts,
    setRemovePosts

} = authSlice.actions


export const authReducer = authSlice.reducer