import React, {SyntheticEvent, useEffect, useRef, useState} from 'react';
import clsx from "clsx";

import s from "./StatusModal.module.scss"

import {MdOutlineMonochromePhotos, MdPhoto} from "react-icons/md"
import {IoMdClose} from "react-icons/io"

import {createPosts, setEdit, setModal, updatePosts} from "../../redux/slices/postsSlice";
import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {setNotify, setNotifyReset} from "../../redux/slices/notifySlices";
import {imageUpload} from "../../utils/ImageUploaded";
import {fetchDataApi} from "../../api/postDataApi";
import {IMAGES} from "../../images";
import Icons from "../Icons";
import {imageShow, videoShow} from "../../utils/mediaShow";


const StatusModal = () => {
    const dispatch = useAppDispatch()

    const {user, token} = useAppSelector((state: RootState) => state.auth)
    const {socket} = useAppSelector((state: RootState) => state.socket)
    const {theme} = useAppSelector((state: RootState) => state.notify)
    const {edit} = useAppSelector((state: RootState) => state.posts)

    const [content, setContent] = useState<string>("")
    const [images, setImages] = useState<any[]>([])
    const [stream, setStream] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [tracks, setTracks] = useState<any>()

    const useVideoRef = useRef<HTMLVideoElement>(null)
    const useCanvasRef = useRef<HTMLCanvasElement>(null)

    console.log("images - ", images)

    const handleChangeImage = (e: any) => {
        let err = ""
        let newImages: File[] | string[] = []
        if (!e.target.files) {
            return err = "File does not exist";
        }

        const files = [...e.target.files]


        files.forEach(file => {
            if (file.size > 1024 * 1024 * 5) {
                return err = "The image/video largest is 5mb"
            }
            return newImages.push(file)
        })

        if (err.length > 0) {
            dispatch(setNotify({error: [{msg: err}]}))
        }
        setImages([...images, ...newImages])
    }


    const deleteImage = (index: number) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }
    const handleScreenCamera = () => {
        setStream(true)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true})
                .then(mediaStream => {
                    useVideoRef.current!.srcObject = mediaStream
                    useVideoRef.current!.play()
                    const track = mediaStream.getTracks()
                    setTracks(track[0])
                })
                .catch(err => console.log(err))
        }
    }
    const handleScreenCapture = () => {
        const width = useVideoRef.current!.clientWidth
        const height = useVideoRef.current!.clientHeight

        useCanvasRef.current!.setAttribute("width", width as any)
        useCanvasRef.current!.setAttribute("height", height as any)
        const ctx = useCanvasRef.current!.getContext("2d")
        ctx!.drawImage(useVideoRef.current!, 0, 0, width, height)
        let URL = useCanvasRef.current!.toDataURL()
        setImages([...images, {camera: URL}])
    }
    const handleStreamStop = () => {
        tracks.stop()
        setStream(false)
    }


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()
        let err = ""
        let media: string[] = []
        setLoading(true)

        for (let img of images) {
            if (img.camera) {
                const {success, error} = await imageUpload(img.camera)
                media.push((success as any).url)
                err = error
            } else {
                const {success, error} = await imageUpload(img)
                media.push((success as any).url)
                err = error
            }
        }

        if (media.length === 0) {
            return dispatch(setNotify({error: [{msg: "Please add photo!"}]}))
        } else {
            dispatch(setNotifyReset())

        }


        if (edit) {
            await dispatch(updatePosts({content, images: media, user, id: edit._id, token}))
        } else {
            const data = await dispatch(createPosts({content, images: media, user, token}))

            if (data) {
                let id = (data as any).payload.newPost._id
                const msg = {
                    id,
                    recipients: (data as any).payload.newPost.user.followers,
                    url: `/post/${id}`,
                    text: "added a new post.",
                    content,
                    image: media[0]
                }

                const {success} = await fetchDataApi.postData("notify", token!, {msg})
                if (success.notify) {
                    socket.emit("createNotify", {
                        ...success.notify,
                        user: {
                            id: user._id,
                            username: user.username,
                            avatar: user.avatar
                        }
                    })
                }
            }
        }

        setContent(" ")
        setImages([])
        dispatch(setModal(false))

        if (tracks) tracks.stop()

    }
    useEffect(() => {
        if (edit) {
            setContent(edit.content)
            setImages(edit.images)
        }
    }, [edit])
    const handleClose = () => {
        dispatch(setModal(false))
        dispatch(setEdit(null))
    }




    return (
        <div className={s.modal}>
            <form onSubmit={handleSubmit} className={clsx(theme === "light" && s.dark_theme)}>
                <div>
                    <h5>Create Posts</h5>
                    <span role="button" onClick={handleClose}>&times;</span>
                </div>

                <div>
                    <textarea
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        name="content"
                        placeholder={`${user?.username}, what are you thinking? `}>

                    </textarea>
                    <div className={s.imageBox}>

                        {images?.map((img: any, index: number) => {
                            return (
                                <div key={index}>
                                    {
                                        img?.camera
                                            ? imageShow(img.camera)
                                            : img?.url
                                                ? <>
                                                    {
                                                        img.url?.match(/video/i)
                                                            ? videoShow(img?.url)
                                                            : videoShow(img?.url)
                                                    }
                                                </>
                                                :
                                                (
                                                    <>
                                                        {
                                                            img?.type?.match(/video/i)
                                                                ? videoShow(URL.createObjectURL(img))
                                                                : imageShow(typeof img === "object" ? URL.createObjectURL(img) : img)
                                                        }
                                                    </>
                                                )

                                    }
                                    <span role="button" onClick={() => deleteImage(index)}>
                                        <IoMdClose/>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                    {stream && (
                        <div>
                            <video
                                src=""
                                autoPlay
                                muted
                                ref={useVideoRef}
                                width="100%"
                                height="100%"
                            />
                            <span className={s.stopStream} role="button" onClick={handleStreamStop}>
                                <IoMdClose/>
                            </span>
                            <canvas ref={useCanvasRef} style={{display: "none"}}/>
                        </div>
                    )}
                    <div className={s.file}>
                        {stream ? (
                            <>
                                <span role="button" onClick={handleScreenCapture}>
                                    <MdOutlineMonochromePhotos/>
                                </span>
                            </>
                        ) : (
                            <>
                                <span role="button" onClick={handleScreenCamera}>
                                    <MdOutlineMonochromePhotos/>
                                </span>
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
                                        onChange={handleChangeImage}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                </div>

                <div>
                    <div>
                        <Icons setContent={setContent}/>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? (
                            <img src={IMAGES.spinner} alt="spinner"/>
                        ) : "Post"}
                    </button>
                </div>
            </form>

        </div>
    );
};

export default StatusModal;