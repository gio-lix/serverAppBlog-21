import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom"
import clsx from "clsx";
import s from "./Info.module.scss"

import {postProfileDataApi, postProfilePosts, setProfileUsers} from "../../../redux/slices/authSlices";
import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";

import {fetchDataApi} from "../../../api/postDataApi";
import {IMAGES} from "../../../images";

import EditProfile from "../editProfile";
import FollowBtn from "../followBtn";
import Followers from "../followers";
import Following from "../following";


const Info = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const editRef = useRef<HTMLDivElement | null>(null)
    const {token, profile, user, ids, status} = useAppSelector((state: RootState) => state.auth)
    const [onEdit, setOnEdit] = useState(false)
    const [count, setCount] = useState(0)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>()


    useEffect(() => {
        const getUser = async () => {
            const {success} = await fetchDataApi.getData(`user/${id}`, token!)
            if (success) {
                dispatch(setProfileUsers(success?.user))
                dispatch(postProfilePosts({id, token}))
            }
        }
        if (ids.every((item: any) => item !== id)) {
            getUser()
        }
    }, [id, user, ids,count, token])


    useEffect(() => {
        dispatch(postProfileDataApi({id, token}))
    }, [id, token, dispatch ])

    const handleClick = (e: any) => {
        if (!e.path.includes(editRef.current)) {
            setOnEdit(false)
        }
    }
    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [])


    useEffect(() => {
        (async () => {
            const {success} = await fetchDataApi.getData(`user/${id}`, token!)
            if (success) setCurrentUser(success.user)
        })()
    }, [id, count, token])

    return (
        <>
            {status === "loading" ? (
                <>
                    <div className={s.loading}>
                        <img src={IMAGES.spinner} alt="spinner"/>
                    </div>
                </>
            ) : (
                <>
                    <main  className={clsx(s.user, onEdit && s.hover)}>
                        <section className={s.grid}>
                            <img src={currentUser?.avatar} alt="user"/>
                            <div>
                                <h3>{currentUser?.username}</h3>
                                <div className={s.follow}>
                                    <span
                                        onClick={() => setShowFollowers(true)}>{profile?.followers?.length} followers</span>
                                    <span
                                        onClick={() => setShowFollowing(true)}>{profile?.following?.length} following</span>
                                </div>
                                <h6 className={s.fullname}>{currentUser?.fullname}</h6>
                                <address>{currentUser?.address}</address>
                                <h6 className={s.email}>{currentUser?.email}</h6>
                                <a className={s.website} href={currentUser?.website} target="_blank" rel="noreferrer">
                                    {currentUser?.website}
                                </a>
                                <p className={s.story}>{currentUser?.story}</p>
                            </div>

                            <div ref={editRef}>
                                {currentUser?._id === user?._id ? (
                                    <button className={s.button} onClick={() => setOnEdit(true)}>Edit Profile</button>
                                ) : (
                                    <FollowBtn user={profile!}/>
                                )}
                                {onEdit &&
                                    <EditProfile
                                        setOnEdit={setOnEdit}
                                        setCount={setCount}
                                    />
                                }
                            </div>
                        </section>
                        <div>
                            {/*<p>{profile?.story}</p>*/}
                        </div>
                        {showFollowers && (
                            <Followers
                                profile={profile!}
                                showFollowers={showFollowers}
                                setShowFollowers={setShowFollowers}
                            />
                        )}
                        {showFollowing && (
                            <Following
                                profile={profile!}
                                showFollowing={showFollowing}
                                setShowFollowing={setShowFollowing}
                            />
                        )}
                    </main>
                </>
            )}
        </>

    );
};

export default Info;