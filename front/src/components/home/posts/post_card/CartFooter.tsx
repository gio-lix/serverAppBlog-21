import React, {FC, useEffect, useState} from 'react';

import s from "./PostCard.module.scss"

import {TbMessageCircle2} from "react-icons/tb"
import {BiPaperPlane} from "react-icons/bi"
import {BsFillBookmarkFill} from "react-icons/bs"
import {RiBookmarkLine,} from "react-icons/ri"

import {RootState, useAppDispatch, useAppSelector} from "../../../../redux/store";
import {setLikes, setUnLikes} from "../../../../redux/slices/postsSlice";
import {setRemovePosts, setSavePosts} from "../../../../redux/slices/authSlices";
import LikeButton from "../../../LikeButton";
import {setNotify} from "../../../../redux/slices/notifySlices";
import ShareModal from "../../../ShareModal";
import {PostsState} from "../../../../typing";
import {fetchDataApi} from "../../../../api/postDataApi";
import {API_URL} from "../../../../utils/config";


interface Props {
    post: PostsState
}


const CartFooter: FC<Props> = ({post}) => {
    const dispatch = useAppDispatch()

    const {token, user} = useAppSelector((state: RootState) => state.auth)
    const {socket} = useAppSelector((state: RootState) => state.socket)

    const [isShare, setIsShare] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)


    const handleLike = async () => {
        dispatch(setLikes({postId: post?._id, userId: user?._id}))
        socket.emit("likePost", {post, userId: user?._id})


        const msg = {
            id: user._id,
            recipients: [post.user._id],
            url: `/post/${post?._id}`,
            text: "like your post.",
            content: post.content,
            image: post.images[0]
        }

        await fetchDataApi.updateData(`posts/${post?._id}/like`, token!)

        const {success} = await fetchDataApi.postData("notify", token!, {msg})

        if (success.notify) {
            socket.emit("createNotify", {
                ...msg,
                user: {
                    id: user._id,
                    username: user.username,
                    avatar: user.avatar
                }
            })
        }


    }
    const handleUnlike = async () => {
        dispatch(setUnLikes({postId: post?._id, userId: user?._id}))
        socket.emit("unLikePost", {post, userId: user?._id})

        const msg = {
            id: user._id,
            recipients: [post.user._id],
            url: `/post/${post?._id}`,
            text: "unlike your post.",
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar
            }
        }


        try {
            await fetchDataApi.updateData(`posts/${post?._id}/unlike`, token!)
            await fetchDataApi.deleteData(`notify/${msg.id}?url=${msg.url}`, token!)
            socket.emit("removeNotify", {...msg})
        } catch (err) {
            dispatch(setNotify({error: [(err as any).response.data]}))
            return
        }
    }

    useEffect(() => {
        if (user?.saved?.find(el => el === post?._id)) {
            setSaved(true)
        }
    }, [user.saved, post])


    const onHandleSave = async (id: string) => {
        dispatch(setSavePosts({postId: post._id}))
        await fetchDataApi.updateData(`savePost/${id}`, token!)
    }

    const onHandleUnSave = async (id: string) => {
        dispatch(setRemovePosts({postId: post._id}))
        await fetchDataApi.updateData(`unSavePost/${id}`, token!)
    }


    return (
        <div className={s.footer}>
            <div>
                <div className={s.footer_icon}>
                    <LikeButton
                        like={post?.likes.includes(user?._id!)}
                        handleLike={() => handleLike()}
                        handleUnlike={() => handleUnlike()}
                    />
                    <span>
                        <TbMessageCircle2/>
                    </span>
                    <span onClick={() => setIsShare(!isShare)}>
                        <BiPaperPlane/>
                    </span>
                </div>
                <div onClick={() => setSaved(!saved)} className={s.book_marker}>
                    {saved ? (
                        <span
                            // onClick={() => dispatch(setRemovePosts({postId: post._id, userId: user?._id}))}
                            onClick={() => onHandleUnSave(post._id)}
                        >
                            <BsFillBookmarkFill/>
                        </span>
                    ) : (
                        <span onClick={() => onHandleSave(post._id)}>
                            <RiBookmarkLine/>
                        </span>
                    )}
                </div>
            </div>
            <div>
                {isShare && (
                    <ShareModal url={`${API_URL}/api/post/${post._id}`}/>
                )}
            </div>
            <div>
                <h6>{post?.likes.length}</h6>
                <h6>{post?.comments.length} comments</h6>
            </div>
        </div>
    );
};

export default CartFooter;