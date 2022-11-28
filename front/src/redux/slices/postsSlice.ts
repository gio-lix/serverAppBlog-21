import axios from "axios";

import {createAsyncThunk, createSlice, current, PayloadAction} from "@reduxjs/toolkit";

import {setNotify} from "./notifySlices";
import {CommentState, PostsState, UserState} from "../../typing";


const initialState = {
    status: "loaded",
    modal: false,
    edit: null as PostsState | null,
    posts: [] as PostsState[],
    post: null as PostsState | any,
    postSaved: [] as any,
    discoveryPosts: {
        posts: [] as PostsState[],
        result: 0,
        page: 2
    },
    result: 0,
    pages: 1
}


interface DiscoveryAction {
    posts: PostsState[]
    result: number
    page: number
}

type State = typeof initialState


export const createPosts = createAsyncThunk<{ newPost: PostsState }, any>(
    "posts/createPosts",
    async (params, {dispatch}) => {
        const {token, content, images} = params

        try {
            const {data} = await axios.post(`/api/posts`, {content, images}, {
                headers: {
                    'Authorization': `${token}`
                }
            })

            console.log("DAta - ", data)
            dispatch(setNotify({success: [{msg: data.msg}]}))
            return data
        } catch (err) {
            console.log("err - ", err)
        }
    }
)
export const updatePosts = createAsyncThunk<{ newPost: PostsState }, any>(
    "posts/updatePosts",
    async (params, {dispatch}) => {
        const {token, content, images, id} = params

        try {
            const {data} = await axios.put(`/api/posts/${id}`, {content, images}, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            dispatch(setNotify({success: [{msg: data.msg}]}))
            return data
        } catch (err) {
            return
        }
    }
)
export const getPosts = createAsyncThunk<{ posts: PostsState[], result: number }, any>(
    "posts/getPosts",
    async (params, {dispatch}) => {
        try {
            const {data} = await axios.get(`/api/posts`, {
                headers: {
                    'Authorization': `${params.token}`
                }
            })
            return data
        } catch (err) {
            dispatch(setNotify({error: [(err as any).response.data]}))
            return
        }
    }
)
export const likePost = createAsyncThunk<Object, any>(
    "posts/likePost",
    async (params, {dispatch}) => {
        const {token, postId, userId} = params
        try {
            const {data} = await axios.put(`/api/posts/${postId}/like`, null, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            return {data, postId, userId}
        } catch (err) {
            return
        }
    }
)
export const getPostApi = createAsyncThunk<{ post: PostsState }, any>(
    "post/getPostApi",
    async (params, {dispatch}) => {
        try {
            const {data} = await axios.get(`/api/post/${params.id}`, {
                headers: {
                    'Authorization': `${params.token}`
                }
            })
            return data
        } catch (err) {
            return
        }
    }
)
export const getDiscoveryPostApi = createAsyncThunk<DiscoveryAction, any>(
    "post/getDiscoveryPostApi",
    async (params, {dispatch}) => {
        try {
            const {data} = await axios.get(`/api/post_discover?page=${params.page}`, {
                headers: {
                    'Authorization': `${params.token}`
                }
            })
            return data
        } catch (err) {
            return
        }
    }
)

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setModal: (state: State, action: PayloadAction<boolean>) => {
            state.modal = action.payload
        },

        setEdit: (state: State, action: PayloadAction<PostsState | null>) => {
            state.edit = action.payload
        },

        setLoadPosts: (state: State, action: PayloadAction<{ result: number, posts: PostsState[] }>) => {
            state.posts = [...state.posts, ...action.payload.posts]
            state.result = state.result + action.payload.result
            state.pages = state.pages + 1
        },

        setComments: (state: State, action: PayloadAction<{ postId: string, newComment: CommentState }>) => {
            const {postId, newComment} = action.payload

            let findIndex = state.posts.findIndex(e => e._id === postId)
            state.posts[findIndex].comments.push(newComment)

            state.post?._id === postId && state.post?.comments.push(newComment)
        },


        setLikes: (state: State, action: PayloadAction<{ userId: string, postId: string }>) => {
            const findIndex = state.posts.findIndex(e => e._id === action.payload.postId)

            state.posts[findIndex].likes.push(action.payload.userId)

            state.post?._id === action.payload.postId && state.post?.likes.unshift(action.payload.userId)

        },

        setUnLikes: (state: State, action: PayloadAction<{ postId: string, userId: string }>) => {
            const findIndex = state.posts.findIndex(e => e._id === action.payload.postId)
            state.posts[findIndex].likes.includes(action.payload.userId) && state.posts[findIndex].likes.pop()


            let ifTrue = state.post?._id === action.payload.postId
            if (ifTrue) {
                state.post.likes = state.post?.likes.filter((ele: string) => ele !== action.payload.userId)
            }


        },

        setCommentLike: (state: State, action: PayloadAction<{ postId: string, commentId: string, user: UserState }>) => {
            const findIndex = state.posts.findIndex(e => e._id === action.payload.postId)
            const findCommentIndex = state.posts[findIndex].comments.findIndex(e => e._id === action.payload.commentId)
            state.posts[findIndex].comments[findCommentIndex].likes.push(action.payload.user)

            state.post?._id === action.payload.postId && state.post.comments[findCommentIndex].likes.push(action.payload.user)
        },

        setCommentUnLike: (state: State, action: PayloadAction<{ postId: string, commentId: string, user: UserState }>) => {
            const findIndex = state.posts.findIndex(e => e._id === action.payload.postId)
            const findCommentIndex = current(state.posts[findIndex]).comments.findIndex(e => e._id === action.payload.commentId)

            state.posts[findIndex].comments[findCommentIndex].likes = state.posts[findIndex].comments[findCommentIndex].likes.filter((el) => el._id !== action.payload.user._id)

            let ifTrue = state.post?._id === action.payload.postId
            if (ifTrue) {
                (state.post as PostsState).comments[findCommentIndex].likes = state.post?.comments[findCommentIndex].likes.filter((el: PostsState) => el._id !== action.payload.user._id)
            }
        },

        setUpdateComment: (state: State, action: PayloadAction<{ comment: string | CommentState, postId: string }>) => {
            const findIndex = state.posts.findIndex(e => e._id === action.payload.postId)
            state.posts[findIndex].comments.map(com => {
                if (com._id === action.payload.comment) {
                    return action.payload.comment
                }
                return com
            })

        },

        setDiscoveryPosts: (state: State, action: PayloadAction<{ result: number, posts: PostsState[] }>) => {
            state.discoveryPosts.posts = action.payload.posts
            state.discoveryPosts.result = action.payload.result
            state.discoveryPosts.page = 2
        },

        setUpdateDiscoveryPosts: (state: State, action: PayloadAction<{ result: number, posts: PostsState[] }>) => {
            state.discoveryPosts.posts = [...state.discoveryPosts.posts, ...action.payload.posts]
            state.discoveryPosts.result = state.discoveryPosts.result + action.payload.result
            state.discoveryPosts.page = state.discoveryPosts.page + 1
        },

        setCommentRemove: (state: State, action: PayloadAction<{ postId: string, commentId: string }>) => {
            let findPostIdx = state.posts.findIndex(post => post._id === action.payload.postId)
            state.posts[findPostIdx].comments = state.posts[findPostIdx].comments.filter(el => el._id !== action.payload.commentId)
        },

        deletePost: (state: State, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post._id !== action.payload)
        }

    },

    extraReducers: (builder) => {
        builder
            .addCase(createPosts.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(createPosts.fulfilled, (state: State, action: PayloadAction<{ newPost: PostsState }>) => {
                state.posts.unshift(action.payload.newPost)
                state.status = "loaded"

            })
            // update
            .addCase(updatePosts.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(updatePosts.fulfilled, (state: State, action: PayloadAction<{ newPost: PostsState }>) => {
                const findIndex = state.posts.findIndex(e => e._id === action.payload.newPost._id)
                state.posts.splice(findIndex, 1, action.payload.newPost)
                state.status = "loaded"

                if (state.post?._id === action.payload.newPost._id) {
                    state.post = action.payload.newPost
                }

            })
            // get posts
            .addCase(getPosts.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(getPosts.fulfilled, (state: State, action: PayloadAction<{ posts: PostsState[], result: number }>) => {
                state.status = "loaded"
                state.posts = action.payload.posts
                state.result = action.payload.result
                state.pages = 2

            })
            // likes
            .addCase(likePost.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(likePost.fulfilled, (state: State, action: PayloadAction<any>) => {
                state.posts.map(post => {
                    if (post._id === action.payload.postId) {
                        return post.likes.push(action.payload.userId)
                    }
                    return post
                })
                state.status = "loaded"
            })
            // post
            .addCase(getPostApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(getPostApi.fulfilled, (state: State, action: PayloadAction<{ post: PostsState }>) => {
                state.status = "loaded"
                state.post = action.payload.post
            })


            // discovery
            .addCase(getDiscoveryPostApi.pending, (state: State) => {
                state.status = "loading"
            })
            .addCase(getDiscoveryPostApi.fulfilled, (state: State, action: PayloadAction<DiscoveryAction>) => {
                state.discoveryPosts.posts = [...state.discoveryPosts.posts, ...action.payload.posts]
                state.discoveryPosts.result = state.discoveryPosts.result + action.payload.result
                state.discoveryPosts.page = state.discoveryPosts.page + 1
                state.status = "loaded"
            })
    }
})

export const {
    setModal,
    setEdit,
    setComments,
    setLikes,
    setUnLikes,
    setUpdateComment,
    setCommentLike,
    setCommentUnLike,
    setCommentRemove,
    setDiscoveryPosts,
    deletePost,
    setLoadPosts
} = postsSlice.actions

export const postsReducer = postsSlice.reducer
