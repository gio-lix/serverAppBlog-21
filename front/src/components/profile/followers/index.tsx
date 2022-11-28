import React, {FC, useEffect, useState} from 'react';
import axios from "axios";
import s from "./Followers.module.scss"

import {RootState, useAppSelector} from "../../../redux/store";
import {useNavigate} from "react-router-dom";
import {UserState} from "../../../typing";
import {IMAGES} from "../../../images";

import UserCard from "../../userCard";
import FollowBtn from "../followBtn";
import clsx from "clsx";


interface Props {
    profile: UserState
    showFollowers: boolean
    setShowFollowers: Function
}

const Followers: FC<Props> = ({showFollowers, setShowFollowers, profile}) => {
    const navigate = useNavigate()

    const {user: auth, token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [loading, setLoading] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<UserState[]>([])

    useEffect(() => {
        setCurrentUser([])
        if (showFollowers) {
            setLoading(true)
            profile?.followers.forEach((e: string) => {
                axios.get(`/api/user/${e}`, {
                    headers: {'Authorization': `${token}`}
                })
                    .then(res => setCurrentUser(prev => [...prev, res.data.user]))
                    .catch(err => console.log(err))
                    .finally(() => setLoading(false))
            })
        }
    }, [showFollowers, profile?.followers])


    const handleLink = (id: string) => {
        setShowFollowers(false)
        navigate(`/profile/${id}`)
        return
    }

    return (
        <div className={s.root}>
            <div className={clsx(theme === "light" && s.followers_theme)}>
                <h1>Followers</h1>
                <button onClick={() => setShowFollowers(false)}>&times;</button>
                {loading ? <img className={s.spinner} src={IMAGES.spinner} alt="spinner"/> : (
                    <>
                        {currentUser.map((user: UserState) => {
                            return (
                                <div key={user._id}>
                                    <UserCard {...user} className={s.className} handleLink={() => handleLink(user._id)}>
                                        {auth?._id !== user._id && <FollowBtn user={user}/>}
                                    </UserCard>
                                </div>
                            )
                        })}
                    </>
                )}

            </div>
        </div>
    );
};

export default Followers;