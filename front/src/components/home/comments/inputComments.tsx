import React, {FC, SyntheticEvent, useState} from 'react';
import {PostsState} from "../../../typing";
import s from "./Comments.module.scss"
import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {setComments} from "../../../redux/slices/postsSlice";
import axios from "axios";
import clsx from "clsx";
import {fetchDataApi} from "../../../api/postDataApi";
import Icons from "../../Icons";

interface Props {
    post: PostsState
    onReply?: any
    setOnReply?: Function
    children?: React.ReactNode
}

const InputComments: FC<Props> = ({post, children, setOnReply, onReply}) => {
    const dispatch = useAppDispatch()
    const [content, setContent] = useState("")
    const {user, token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)
    const {socket} = useAppSelector((state: RootState) => state.socket)


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false)
            return
        }

        const newComment = {
            content,
            likes: [],
            user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }



        try {
            const {data} = await axios.post(`/api/comment`, {
                ...newComment,
                postId: post?._id,
                postUserId: post?.user._id
            }, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            dispatch(setComments({postId: post?._id, newComment: data.newComment}))
            socket.emit("createComment", {
                postId: post?._id,
                newComment: data.newComment
            })

            const msg = {
                id: data.newComment._id,
                recipients: data.newComment.reply ? [data.newComment.tag._id] : [post.user._id],
                url: `/post/${post._id}`,
                text: data.newComment.reply ? "mentioned you in a comment" : "has commented on your post",
                content: data.newComment.content,
                image: post.images[0],
                user: {
                    id: post.user._id,
                    username: post.user.username,
                    avatar: post.user.avatar
                }
            }
            const {success} = await fetchDataApi.postData("notify", token!, {msg})
            if (success.notify) {
                socket.emit("createNotify", {...msg})
            }
        } catch (err) {
            console.log("err - ", err)
        }

        setContent("")
        if (setOnReply) return setOnReply(false)

    }
    return (
        <form onSubmit={handleSubmit} className={clsx(s.input_comment,
            theme === "light" && s.input_dark
            )}>
            <div>
                <Icons className={s.comment_icon} setContent={setContent}/>
            </div>
            {children}
            <input
                type="text"
                placeholder="Add your comments...."
                value={content}
                className={clsx(!!onReply ? s.input_comment_onReply : null)}
                onChange={(e) => setContent(e.target.value)}
            />

            <button type="submit">Post</button>

        </form>
    );
};

export default InputComments;