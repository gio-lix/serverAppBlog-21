import React, {FC, useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

import s from "./Following.module.scss"

import {RootState, useAppSelector} from "../../../redux/store";
import {UserState} from "../../../typing";
import UserCard from "../../userCard";
import FollowBtn from "../followBtn";
import clsx from "clsx";


interface Props {
    profile: UserState
    showFollowing: boolean
    setShowFollowing: Function
}

const Following: FC<Props> = ({setShowFollowing, profile, showFollowing}) => {
    const navigate = useNavigate()
    const {user: auth, token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [currentUser, setCurrentUser] = useState<UserState[]>([])

    useEffect(() => {
        setCurrentUser([])
        profile?.following.forEach((e: string) => {
            axios.get(`/api/user/${e}`, {
                headers: {'Authorization': `${token}`}
            })
                .then(res => setCurrentUser((prev: UserState[]) => [...prev, res.data.user]))
                .catch(err => console.log(err))
        })
    }, [showFollowing, profile?.following])


    const handleLink = (id: string) => {
        setShowFollowing(false)
        navigate(`/profile/${id}`)
        return
    }
    return (
        <div className={s.root}  >
            <div  className={clsx(theme === "light" && s.following_theme)}>
                <h1>Followers</h1>
                <button onClick={() => setShowFollowing(false)}>&times;</button>
                {currentUser.map((user: UserState) => {
                    return (
                        <div  key={user._id}>
                            <UserCard {...user} className={s.className} handleLink={() => handleLink(user._id)}>
                                {auth?._id !== user._id && <FollowBtn user={user}/>}
                            </UserCard>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Following;