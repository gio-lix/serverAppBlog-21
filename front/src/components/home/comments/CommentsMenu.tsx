import React, {FC} from 'react';
import clsx from "clsx";
import axios from "axios";

import s from "./Comments.module.scss"

import {GoPencil} from "react-icons/go";
import {AiFillDelete} from "react-icons/ai";
import {BsThreeDotsVertical} from "react-icons/bs"

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {setCommentRemove} from "../../../redux/slices/postsSlice";
import {CommentState, PostsState, UserState} from "../../../typing";
import {fetchDataApi} from "../../../api/postDataApi";

interface Props {
    comment: CommentState
    post: PostsState
    auth: UserState
    setOnEdit: Function
}

interface IReplyComment extends CommentState{
    reply: boolean
}


const CommentsMenu: FC<Props> = ({comment, post, auth, setOnEdit}) => {
    const dispatch = useAppDispatch()

    const {token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)
    const {socket} = useAppSelector((state: RootState) => state.socket)


    const onHandleRemove = async () => {
        if (post.user._id === auth._id || comment.user._id === auth._id) {
            dispatch(setCommentRemove({postId: post._id, commentId: comment._id}))
            socket.emit("removeComment", {comment, post})

            const msg = {
                id: comment._id,
                recipients: (comment as IReplyComment).reply ? [comment.tag._id] : [post.user._id],
                url: `/post/${post._id}`,
                text: "delete comment",
                user: {
                    id: post.user._id,
                    username: post.user.username,
                }
            }

            try {
                await axios.delete(`/api/comment/${comment._id}`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                })
                await fetchDataApi.deleteData(`notify/${msg.id}?url=${msg.url}`, token!)
                socket.emit("removeNotify", {...msg})
            } catch (err) {
                console.log(err)
            }
        }

    }


    const MenuItem = () => {
        return (
            <div className={clsx(s.menuItem,
                theme === "light" && s.menuItem_theme
            )}>
                <span onClick={() => setOnEdit(true)}>
                    <GoPencil/> Edit
                </span>
                <span onClick={onHandleRemove}>
                    <AiFillDelete/> Remove
                </span>
            </div>
        )
    }


    return (
        <div className={s.comment_menu}>
            {
                (post.user._id === auth._id || comment.user._id === auth._id) &&
                <div>
                    <span>
                        <BsThreeDotsVertical/>
                    </span>
                    <div className={clsx(s.dop_down,
                        theme === "light" && s.dop_down_theme
                    )}>
                        {post.user._id === auth._id
                            ? comment.user._id === auth._id
                                ? <>{MenuItem()}</>
                                : (
                                    <div className={s.menuItem}>
                                        <span onClick={onHandleRemove}>
                                            <AiFillDelete/> Remove
                                        </span>
                                    </div>
                                )
                            : comment.user._id === auth._id && (<>{MenuItem()}</>)
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default CommentsMenu;


