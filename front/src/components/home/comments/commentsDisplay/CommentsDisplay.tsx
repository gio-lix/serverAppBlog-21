import React, {FC, useEffect, useState} from 'react';
import CommentCard from "./CommentCard";
import {CommentState, PostsState} from "../../../../typing";

interface CommentProps extends CommentState {
    reply: string
}
interface Props {
    comment: CommentState
    post: PostsState
    replyComment: any

}

const CommentsDisplay:FC<Props> = ({comment, post, replyComment}) => {
    const [showRep, setShowRep] = useState<CommentProps[]>([])
    const [next, setNext] = useState(1)

    useEffect(() => {
        setShowRep(replyComment.slice(replyComment.length - next))
    },[replyComment, next])


    return (
        <CommentCard
            comment={comment}  post={post} commentId={comment._id} >
            <div>
                {showRep.map((item: CommentState, index: number) => (
                    <CommentCard
                        comment={item}
                        post={post}
                        commentId={comment._id}
                        key={`${comment._id}_${index}`}
                    />
                ))}
                <div>
                    {
                        replyComment.length - next > 0
                            ? (
                                <p
                                    style={{color:"red", fontSize: "13px"}}
                                    onClick={() => setNext(next + 10)}>
                                    See more reply...
                                </p>
                            )
                            : replyComment.length > 1
                            && (
                                <p
                                    style={{color:"red", fontSize: "13px"}}
                                    onClick={() => setNext(1)}>
                                    Hide reply...
                                </p>
                            )
                    }
                </div>
            </div>
        </CommentCard>
    );
};

export default CommentsDisplay;