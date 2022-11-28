import React, {FC, useEffect, useState} from 'react';

import s from "./FollowBtn.module.scss"

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {setFollowers, setFollowing} from "../../../redux/slices/authSlices";
import {UserState} from "../../../typing";
import {fetchDataApi} from "../../../api/postDataApi";
import {IMAGES} from "../../../images";

interface Props {
    user: UserState
}


const FollowBtn: FC<Props> = ({user}) => {
    const dispatch = useAppDispatch()

    const {socket} = useAppSelector((state: RootState) => state.socket)
    const {token, user: auth} = useAppSelector((state: RootState) => state.auth)

    const [follow, setFollow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)


    useEffect(() => {
        if (auth?.following?.includes(user?._id as string)) {
            setFollow(true)
        }

        return () => setFollow(false)
    }, [user?._id, auth?.following])


    const handleFollow = async () => {
        let newUser = {...user, followers: [...user.followers, auth?._id]}
        let newAuth = {...auth, following: [...(auth as UserState).following, newUser?._id]}

        setLoading(true)

        const {success} = await fetchDataApi.updateData(`user/${user._id}/follow`, token!)
        if (success) {
            const msg = {
                id: user._id,
                text: "has started to follow you. ",
                recipients: [user._id],
                url: `/profile/${auth._id}`,
                user: {
                    id: auth._id,
                    username: auth.username,
                    avatar: auth.avatar
                }
            }

            const {success} = await fetchDataApi.postData("notify", token!, {msg})
            if (success.notify) {
                socket.emit("createNotify", {...msg})
            }

            dispatch(setFollowers(newUser))
            dispatch(setFollowing(newAuth))
            setFollow(true)
            setLoading(false)
        }
    }

    const handleUnfollow = async () => {
        let newUser = {...user, followers: [...user.followers.filter((e: string) => e !== auth?._id)]}
        setLoading(true)

        const {success} = await fetchDataApi.updateData(`user/${user?._id}/unfollow`, token!)
        if (success) {
            const msg = {
                id: user._id,
                text: " ",
                recipients: [user._id],
                url: `/profile/${auth._id}`,
                user: {
                    id: auth._id,
                    username: auth.username,
                    avatar: auth.avatar
                }
            }
            await fetchDataApi.deleteData(`notify/${msg.id}?url=${msg.url}`, token!)
            socket.emit("removeNotify", {...msg})

            dispatch(setFollowers(newUser))
            setFollow(false)
            setLoading(false)
        }
    }

    return (
        <>
            {follow
                ?
                <button onClick={handleUnfollow} className={s.root}>
                    {!loading ? "Unfollow" : (
                        <img src={IMAGES.spinner} alt="spinner"/>
                    )}
                </button>
                :
                <button onClick={handleFollow} className={s.root}>
                    {!loading ? "follow" : (
                        <img src={IMAGES.spinner} alt="spinner"/>
                    )}
                </button>
            }
        </>
    );
};

export default FollowBtn;