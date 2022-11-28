import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ChatDataState, ChatUsersState, CommentState} from "../../typing";






const initialState = {
    users: [] as ChatUsersState[],
    resultUsers: 0,
    data: [] as ChatDataState[],
    resultData: 0,
    firstLoad: false
}

type State = typeof initialState

const messageUsersSlices = createSlice({
    name: "messageUsers",
    initialState,
    reducers: {
        addMessageUsers: (state: State, action: PayloadAction<{user: ChatUsersState}>) => {
            if (state.users.every((item: ChatUsersState) => item._id !== action.payload.user._id)) {
                state.users.push(action.payload.user)
            }

        },
        addMessageData: (state: State, action: PayloadAction<ChatDataState>) => {
            state.data.push(action.payload)
            state.users = state.users.map((user: ChatUsersState) =>
                user._id === action.payload.recipient || user._id === action.payload.sender
                    ? {...user, text: action.payload.text, media: action.payload.media}
                    : user
            )
        },
        setConversation: (state: State, action: PayloadAction<{result: number, data: ChatUsersState}>) => {

            state.users = [action.payload.data]
            state.resultUsers = action.payload.result
            state.firstLoad = true
        },
        addMessageDataApi: (state: State, action: PayloadAction<{result: number, messages: ChatDataState[]}>) => {
            state.resultData = action.payload.result
            state.data = action.payload.messages.reverse()
        },
        setMoreMessages: (state: State, action: PayloadAction<{messages:ChatDataState[], result: number}>) =>  {
            state.resultData = action.payload.result
            state.data.unshift(...action.payload.messages)
        },
        setDeleteMessage: (state: State,action: PayloadAction<ChatDataState>) => {
            state.data = state.data.filter(el => el._id !== action.payload._id)
        },
        setDeleteConversation:(state: State, action: PayloadAction<string>) => {
            state.users = state.users.filter((user) => user._id !== action.payload)
            state.data = state.data = []
        }
    }

})


export const {
    addMessageUsers,
    addMessageData,
    addMessageDataApi,
    setConversation,
    setMoreMessages,
    setDeleteMessage,
    setDeleteConversation
} = messageUsersSlices.actions

export const messageUsersReducers = messageUsersSlices.reducer