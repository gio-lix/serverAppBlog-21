import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {getPostApi} from "../../redux/slices/postsSlice";
import PostCart from "../../components/PostCart";
import {IMAGES} from "../../images";

const PostPage = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()

    const {token} = useAppSelector((state: RootState) => state.auth)
    const {post, status} = useAppSelector((state: RootState) => state.posts)


    useEffect(() => {
        if (token) {
            dispatch(getPostApi({id, token}))
        }
    }, [id, token])

    return (
        <div>
            {status === "loading" ? (
                <div className="loading">
                    <img src={IMAGES.spinner} alt="spinner"/>
                </div>
            ) : (
                <PostCart post={post!}/>
            )}
        </div>
    );
};
export default PostPage