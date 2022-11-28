import React, {useEffect, useRef} from 'react';

import {RootState, useAppDispatch, useAppSelector} from "./redux/store";
import {setCommentRemove, setComments, setLikes, setUnLikes} from "./redux/slices/postsSlice";
import {setDeletePostNotify, setPostNotify} from "./redux/slices/postNotifySlice";

import audioVoice from "./audio/alert.mp3"
import {addMessageData} from "./redux/slices/messageUseresSlices";
import {setOffline, setOnline} from "./redux/slices/notifySlices";

const SocketServer = () => {
    const dispatch = useAppDispatch()

    const {socket} = useAppSelector((state: RootState) => state.socket)
    const {user} = useAppSelector((state: RootState) => state.auth)
    const {sound} = useAppSelector((state: RootState) => state.postNotify)
    const {online} = useAppSelector((state: RootState) => state.notify)

    const audioRef = useRef<HTMLAudioElement>(null)


    const spawnNotification = (body: any, icon: string, url: string, title: string) => {
        let options = {
            body,
            icon
        }
        let n = new Notification(title, options)

        n.onclick = e => {
            e.preventDefault()
            window.open(url, "_blank")
        }
    }

    useEffect(() => {
        socket.emit("joinUser", user)
    }, [socket, user._id, user])

    useEffect(() => {
        socket.on("likeToClient", (newPost: any) => {
            const {post, userId} = newPost.newPost
            dispatch(setLikes({postId: post._id, userId}))
        })
        return () => socket.off("likeToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("unLikeToClient", (newPost: any) => {
            const {post, userId} = newPost.newPost
            dispatch(setUnLikes({postId: post?._id, userId}))
        })
        return () => socket.off("unLikeToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("createCommentToClient", (newComment: any) => {
            dispatch(setComments({postId: newComment.postId, newComment: newComment.newComment}))
        })
        return () => socket.off("createCommentToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("removeCommentToClient", (removeComment: any) => {
            const {comment, post} = removeComment
            dispatch(setCommentRemove({postId: post._id, commentId: comment._id}))
        })
        return () => socket.off("removeCommentToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("addMessageToClient", (message: any) => {
            dispatch(addMessageData(message))
        })
        return () => socket.off("addMessageToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("notifyToClient", (notify: any) => {
            dispatch(setPostNotify(notify))
            if (sound) audioRef.current!.play()
            spawnNotification(
                notify.user.username + " " + notify.text,
                notify.user.avatar,
                notify.url,
                "lemon"
            )
        })
        return () => socket.off("notifyToClient")
    }, [socket, dispatch, sound])

    useEffect(() => {
        socket.on("removeNotifyToClient", (notify: any) => {
            dispatch(setDeletePostNotify(notify))
        })
        return () => socket.off("removeNotifyToClient")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("checkUserOnlineToMe", (data: any) => {
            data.forEach((item: any) => {
                if (!online.includes(item.id)) {
                    dispatch(setOnline(item.id))
                }
            })
        })
        return () => socket.off("checkUserOnlineToMe")
    }, [socket, dispatch])

    useEffect(() => {
        socket.on("checkUserOnlineToClient", (data: any) => {
            data.forEach((item: any) => {
                if (!online.includes(item.id)) {
                    dispatch(setOnline(item.id))
                }
            })
        })
        return () => socket.off("checkUserOnlineToClient")
    }, [socket, online])


    useEffect(() => {
        socket.on("checkUserOffline", (data: any) => {
            dispatch(setOffline(data))
        })
        return () => socket.off("checkUserOffline")
    }, [socket, dispatch])


    useEffect(() => {
        socket.on("callUserToClient", (data: any) => {
            console.log("data - ", data)
        })
        return () => socket.off("callUserToClient")
    },[socket, dispatch])

    return (
        <>
            <audio controls ref={audioRef} style={{display: "none"}}>
                <source src={audioVoice} type="audio/mp3"/>
            </audio>
        </>
    );
};

export default SocketServer;