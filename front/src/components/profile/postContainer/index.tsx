import React, {FC} from 'react';

import s from "./PostContainer.module.scss"

import {PostsState} from "../../../typing";
import {NavLink} from "react-router-dom";
import {IMAGES} from "../../../images";
import {AiOutlineHeart} from "react-icons/ai";
import {BiMessageRounded} from "react-icons/bi";

interface Props {
    posts: any
    children?: React.ReactNode
    status: boolean
}

const PostContainer: FC<Props> = ({posts, children, status}) => {
    return (
        <>
            {status ? (
                <div className="loading_spinner">
                    <img src={IMAGES.spinner} alt="spinner"/>
                </div>
            ) : (
                <section className={s.posts}>
                    {posts?.map((post: PostsState, index: number) => (
                        <NavLink to={`/post/${post?._id}`} key={`${post._id}_${index}`}>
                            <img src={post?.images?.[0]} alt="img"/>
                            <div className={s.info}>
                                <span>
                                    <AiOutlineHeart/>
                                    {post?.likes.length}
                                </span>
                                <span>
                                <BiMessageRounded/>
                                    {post?.comments.length}
                                </span>
                            </div>
                        </NavLink>
                    ))}
                </section>
            )}

            <div>
                {children}
            </div>
        </>
    );
};

export default PostContainer;

