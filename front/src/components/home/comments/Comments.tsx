import React, {FC, useEffect, useState} from 'react';

import s from "./Comments.module.scss"

import {CommentState, PostsState} from "../../../typing";
import CommentsDisplay from "./commentsDisplay/CommentsDisplay";



interface Props {
    post: PostsState
}

interface CommentProps extends CommentState {
    reply: string
}


const Comments: FC<Props> = ({post}) => {

    const [showComments, setShowComments] = useState<CommentState[]>([])
    const [replyComment, setReplyComment] = useState<CommentState[]>([])
    const [comments, setComments] = useState<CommentState[]>([])
    const [next, setNext] = useState<number>(2)


    useEffect(() => {
        const newRap = post?.comments.filter(cm => (cm as CommentProps).reply)
        setReplyComment(newRap)
    }, [post?.comments, post])

    useEffect(() => {
        const newCom = post?.comments.filter(cm => !(cm as CommentProps).reply)
        setComments(newCom)
        setShowComments(newCom?.slice(newCom?.length - next))
    }, [post?.comments, next, post])


    return (
        <div>
            <h2 style={{marginBottom: "10px"}}>Comments</h2>
            {showComments?.map((comment: CommentState, index: number) => (
                <CommentsDisplay
                    key={`${comment._id}_${index}`}
                    post={post}
                    comment={comment}
                    replyComment={replyComment?.filter(item => (item as CommentProps).reply === comment._id)}
                />
            ))}
            <div className={s.comment}>
                {
                    comments?.length - next > 0
                        ? (
                            <div onClick={() => setNext(next + 10)}>
                                See more comments...
                            </div>
                        )
                        : comments?.length > 2
                        && (
                            <div onClick={() => setNext(2)}>
                                Hide Comments...
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default Comments;