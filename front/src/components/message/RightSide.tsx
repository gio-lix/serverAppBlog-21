import React, {SyntheticEvent, useEffect, useRef, useState} from 'react';
import clsx from "clsx";

import s from "./Message.module.scss"

import {RiSendPlane2Fill} from "react-icons/ri"
import {useParams} from "react-router-dom";
import {MdDelete, MdPhoto} from "react-icons/md"
import {RiCloseCircleLine} from "react-icons/ri"
import {AiTwotoneDelete} from "react-icons/ai";
import {IoIosCall} from "react-icons/io";
import {BsFillCameraVideoFill} from "react-icons/bs";

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {
    addMessageData,
    addMessageDataApi, setDeleteConversation,
    setDeleteMessage,
    setMoreMessages
} from "../../redux/slices/messageUseresSlices";

import {ChatDataState, ChatUsersState} from "../../typing";
import {imageShow, videoShow} from "../../utils/mediaShow";
import {setNotify} from "../../redux/slices/notifySlices";
import {imageUpload} from "../../utils/ImageUploaded";
import {fetchDataApi} from "../../api/postDataApi";
import {IMAGES} from "../../images";

import MessageDisplay from "./MessageDisplay";
import UserCard from "../userCard";
import Icons from "../Icons";
import {setCall} from "../../redux/slices/callSlice";


const RightSide = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()

    const {users, data, resultData} = useAppSelector((state: RootState) => state.messageUsers)
    const {user: auth, token} = useAppSelector((state: RootState) => state.auth)
    const {socket} = useAppSelector((state: RootState) => state.socket)
    const {peer} = useAppSelector((state: RootState) => state.call)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [loadingMedia, setLoadingMedia] = useState<boolean>(false)
    const [user, setUser] = useState<any>()
    const [text, setText] = useState<string>("")
    const [media, setMedia] = useState<any>([])

    const [pageNumber, setPageNumber] = useState<number>(1)


    const useRefDisplay = useRef<any>()
    const useRefEnd = useRef<any>()

    useEffect(() => {
        const newUser = users.find((user: ChatUsersState) => user._id === id)
        if (newUser) {
            setUser(newUser)
        }
    }, [users, id])


    const handleSubmit = async (e: SyntheticEvent) => {

        e.preventDefault()
        if (!text.trim()) return

        if (useRefDisplay.current) {
            useRefDisplay.current.scrollIntoView({behavior: "smooth", block: "end"})
        }
        setLoadingMedia(true)


        let _newArr: any = []
        if (media.length > 0) {
            for (let img of media) {
                const {success} = await imageUpload(img)
                _newArr.push((success as any).url)
            }
        }


        const msg: ChatDataState = {
            sender: auth._id,
            recipient: id!,
            text,
            media: _newArr,
            createdAt: new Date().toISOString()
        }


        dispatch(addMessageData(msg))
        setLoadingMedia(false)
        setText("")
        setMedia([])


        socket.emit("addMessage", msg)
        await fetchDataApi.postData(`message`, token!, {...msg})

    }
    const onHandleMediaChange = (e: { target: { files: any; }; }) => {
        let err = ""
        let newMedia: any = []
        if (!e.target.files) {
            return err = "File does not exist";
        }

        const files = [...e.target.files]


        files.forEach(file => {
            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb"
            }
            return newMedia.push(file)
        })

        if (err.length > 0) {
            dispatch(setNotify({error: [{msg: err}]}))
        }
        setMedia([...media, ...newMedia])
    }

    const handleDeleteMedia = (index: number) => {
        let _newMedia = [...media]
        _newMedia.splice(index, 1)
        setMedia(_newMedia)
    }

    useEffect(() => {
        fetchDataApi.getData(`messages/${id}`, token!)
            .then(({success}) => {
                dispatch(addMessageDataApi(success))
                if (useRefDisplay.current) {
                    useRefDisplay.current.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                    })
                }
            })
            .catch(err => console.log(err))
    }, [id, auth])
    useEffect(() => {
        if (resultData < 6) return
        fetchDataApi.getData(`messages/${id}?page=${pageNumber}`, token!)
            .then(({success}) => {
                dispatch(setMoreMessages(success))
                useRefDisplay.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                })
            })
    }, [pageNumber])
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPageNumber(prev => prev + 1)
            }
        }, {
            threshold: 0.1
        })
        observer.observe(useRefEnd.current)
    }, [useRefEnd])

    const handleDeleteMessage = async (msg: ChatDataState) => {
        dispatch(setDeleteMessage(msg))
        await fetchDataApi.deleteData(`/messages/${msg._id}`, token!)
    }

    const onHandleConversationDelete = async (id: string) => {
        dispatch(setDeleteConversation(id))
        fetchDataApi.deleteData(`conversation/${id}`, token!)
            .then((res) => console.log("res - ", res))
    }

    const caller = ({video}: any) => {
        const {_id, avatar, username, fullname} = user

        const msg = {
            sender: auth._id,
            recipient: _id,
            avatar,
            username,
            fullname,
            video
        }
        dispatch(setCall({msg}))

    }

    const callUser = ({video}: any) => {
        const {_id, avatar, username, fullname} = auth

        const msg = {
            sender: _id,
            recipient: user._id,
            avatar,
            username,
            fullname,
            video
        }
        if (peer.open) (msg as any).peerId = peer._id

        socket.emit("callUser", msg)
    }


    const onHandleAudioCall = () => {
        caller({video: false})
        callUser({vidoe: false})
    }

    const onHandleVideo = () => {
        caller({video: true})
        callUser({vidoe: true})
    }

    return (
        <div className={s.rightSide}>
            {user && (
                <UserCard
                    {...user! as any}
                    className={clsx(s.rightSide_deleteIcons, s.rightSide_users_styles)}
                >

                   <div className={s.rightSide_media}>
                        <span onClick={onHandleAudioCall}>
                            <IoIosCall />
                        </span>
                       <span  onClick={onHandleVideo}>
                           <BsFillCameraVideoFill />
                       </span>
                        <span role="button" onClick={() => onHandleConversationDelete(user._id)}>
                            <MdDelete/>
                        </span>
                   </div>
                </UserCard>
            )}
            <div className={clsx(s.rightSide_body_box, theme === "light" && s.right_side_theme)}>
                <div ref={useRefDisplay} className={s.chat_display}>
                    <button style={{marginTop: "-25px", visibility: "hidden"}} ref={useRefEnd}>
                        load more
                    </button>
                    {data?.map((msg: any, index: number) => {
                        return (
                            <div key={index}>
                                {
                                    msg.sender !== auth._id &&
                                    <div className={clsx(s.chat_row, s.chat_other)}>
                                        <MessageDisplay user={user!} msg={msg}/>
                                    </div>
                                }
                                {
                                    msg.sender === auth._id &&
                                    <div className={clsx(s.chat_row, s.chat_me, "d-flex")}>
                                         <span onClick={() => handleDeleteMessage(msg)}>
                                             <AiTwotoneDelete/>
                                         </span>
                                        <div>
                                            <MessageDisplay user={auth!} msg={msg}/>
                                        </div>
                                    </div>

                                }
                            </div>
                        )
                    })}
                    {
                        loadingMedia &&
                        <div className={s.chat_send_loading}>
                            <img src={IMAGES.spinner} style={{width: "30px", height: "30px"}} alt=""/>
                        </div>
                    }
                </div>
                <div>
                    <div className={s.chat_send_images}>
                        {media.map((item: any, index: number) => {
                            return (
                                <div className={s.rightSide_body_box_media} key={index}>
                                    {

                                        item.type.match(/video/i)
                                            ? videoShow(URL.createObjectURL(item))
                                            : imageShow(typeof item === "object" ? URL.createObjectURL(item) : item)
                                    }
                                    <span onClick={() => handleDeleteMedia(index)}>
                                        <RiCloseCircleLine/>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={s.rightSide_body_box_form}>
                    <form onSubmit={handleSubmit}>
                        <div className={s.icons}>
                            <Icons setContent={setText} className={s.icons_styles}/>
                        </div>
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Enter you message..."
                        />

                        <div>
                            <label htmlFor="file">
                                <MdPhoto/>
                            </label>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                multiple
                                accept="image/*,video/*"
                                hidden
                                onChange={onHandleMediaChange}
                            />
                        </div>

                        <button disabled={!text} type="submit">
                            <RiSendPlane2Fill/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RightSide;