import React, {FC} from 'react';
import {useLocation, useParams} from "react-router-dom"
import clsx from "clsx";

import {RootState, useAppSelector} from "../redux/store";
import {PostsState} from "../typing";

import CartHeader from "./home/posts/post_card/CartHeader";
import CartBody from "./home/posts/post_card/CartBody";
import CartFooter from "./home/posts/post_card/CartFooter";
import Comments from "./home/comments/Comments";
import InputComments from "./home/comments/inputComments";

interface Props {
    post: PostsState
}

const PostCart: FC<Props> = ({post}) => {
    const {id} = useParams()
    const {pathname} = useLocation()

    const {theme} = useAppSelector((state: RootState) => state.notify)


    return (
        <div
            className={clsx("post_cart", pathname === `/post/${id}` && "post_cart_id",
                theme === "light" ? "background_theme" : "light_theme"
            )}>
            <CartHeader post={post}/>
            <CartBody post={post}/>
            <CartFooter post={post}/>
            <Comments post={post}/>
            <InputComments post={post}/>
        </div>
    );
};

export default PostCart;