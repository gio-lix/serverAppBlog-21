import React, {FC, useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import moment from "moment";
import clsx from "clsx";
import {GoPencil} from "react-icons/go"

import s from "./PostCard.module.scss"

import {AiFillDelete, AiOutlineCopy} from "react-icons/ai"
import {HiDotsHorizontal} from "react-icons/hi"

import {RootState, useAppDispatch, useAppSelector} from "../../../../redux/store";
import {deletePost, setEdit, setModal} from "../../../../redux/slices/postsSlice";

import {PostsState} from "../../../../typing";
import {fetchDataApi} from "../../../../api/postDataApi";
import {API_URL} from "../../../../utils/config";

interface Props {
    post: PostsState

}

const CartHeader: FC<Props> = ({post}) => {
    const {pathname,} = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {user, token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)
    const {socket} = useAppSelector((state: RootState) => state.socket)

    const useInfoRef = useRef<HTMLDivElement | null>(null)

    const [drop, setDrop] = useState<boolean>(false)


    const handleClickRef = (e: any) => {
        if (!e.path.includes(useInfoRef.current)) {
            setDrop(false)
        }
    }
    useEffect(() => {
        window.addEventListener("click", handleClickRef)
        return () => window.removeEventListener("click", handleClickRef)
    }, [useInfoRef.current])
    const handleEditPost = () => {
        setDrop(false)
        dispatch(setModal(true))
        dispatch(setEdit(post))
    }

    const handleDelete = async (id: string) => {
        let path = pathname === `/post/${id}`
        dispatch(deletePost(id))
        if (path) {
            navigate("/")
        }


        const {success} = await fetchDataApi.deleteData(`post/${id}`, token!)
        if (success) {
            const msg = {
                id: success.post._id,
                recipients: success.post.user.followers,
                url: `/post/${success.post._id}`,
                text: "added a new post.",
                content: success.post.content,
                image: success.post.images[0]
            }
            const {success: delSuccess} = await fetchDataApi.deleteData(`notify/${msg.id}?url=${msg.url}`, token!)
            if (delSuccess) {
                socket.emit("removeNotify", {
                    ...delSuccess.notify,
                    user: {
                        id: user._id,
                        username: user.username,
                        avatar: user.avatar
                    }
                })
            }
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(`${API_URL}/api/post/${post._id}`)
        setDrop(false)
    }

    return (
        <div className={s.header}>
            <div>
                <img
                    className={s.header_avatar}
                    src={post?.user?.avatar}
                    alt="avatar"
                    loading='lazy'
                />
                <div>
                    <h6>
                        <Link to={`/profile/${post?.user._id}`}>
                            {post?.user.username}
                        </Link>
                    </h6>
                    <small>
                        {moment(post?.createdAt).fromNow()}
                    </small>
                </div>
            </div>
            <div ref={useInfoRef} className={s.header_drop}>
                <span className={clsx(theme === "light" ? s.dropDown_black : s.dropDown)}
                      onClick={() => setDrop(!drop)}>
                    <HiDotsHorizontal/>
                </span>
                {/*{(drop && user?._id === post?.user._id) && (*/}
                {/*    <div className={clsx(s.header_drop_menu,*/}
                {/*        theme === "light" && s.dark_theme*/}
                {/*    )}>*/}
                {/*        <>*/}
                {/*            <div onClick={handleEditPost}>*/}
                {/*                <GoPencil/> Edit Post*/}
                {/*            </div>*/}
                {/*            <div onClick={() => handleDelete(post._id)}>*/}
                {/*                <AiFillDelete/> Remove Post*/}
                {/*            </div>*/}
                {/*            <div onClick={() => handleCopy()}>*/}
                {/*                <AiOutlineCopy/> copy Post*/}
                {/*            </div>*/}
                {/*        </>*/}
                {/*    </div>*/}
                {/*)}*/}
                {drop && (
                    <div className={clsx(s.header_drop_menu,
                        theme === "light" && s.dark_theme
                    )}>
                        <>
                            {user?._id === post?.user._id && (
                                <>
                                    <div onClick={handleEditPost}>
                                        <GoPencil/> Edit Post
                                    </div>
                                    <div onClick={() => handleDelete(post._id)}>
                                        <AiFillDelete/> Remove Post
                                    </div>
                                </>
                            )}

                            <div onClick={() => handleCopy()}>
                                <AiOutlineCopy/> copy Post
                            </div>
                        </>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartHeader;