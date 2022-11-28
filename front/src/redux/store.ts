import {combineReducers, configureStore} from "@reduxjs/toolkit";

import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

import {authReducer} from "./slices/authSlices"
import {postsReducer} from "./slices/postsSlice"
import {notifyReducer} from "./slices/notifySlices"
import {savedPostsReducer} from "./slices/postSavedSlice";
import {socketReducer} from "./slices/socketSlice";
import {postNotifySliceReducer} from "./slices/postNotifySlice";
import {messageUsersReducers} from "./slices/messageUseresSlices";
import {callReducer} from "./slices/callSlice";


const rootReducer = combineReducers({
    auth: authReducer,
    posts: postsReducer,
    savedPosts: savedPostsReducer,
    notify: notifyReducer,
    socket: socketReducer,
    postNotify: postNotifySliceReducer,
    messageUsers: messageUsersReducers,
    call: callReducer
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),

})

export type RootState = ReturnType<typeof store.getState>
export type AddDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AddDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store