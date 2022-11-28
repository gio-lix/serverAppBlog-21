import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom"
import {GoPrimitiveDot} from "react-icons/go"
import clsx from "clsx";

import s from "./Message.module.scss"

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {addMessageUsers, setConversation} from "../../redux/slices/messageUseresSlices";
import {fetchDataApi} from "../../api/postDataApi";
import {ChatUsersState, UserState} from "../../typing";
import UserCard from "../userCard";


const LeftSide = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {id} = useParams()

    const {socket} = useAppSelector((state: RootState) => state.socket)
    const {token, user: auth} = useAppSelector((state: RootState) => state.auth)
    const {users, firstLoad} = useAppSelector((state: RootState) => state.messageUsers)
    const {online} = useAppSelector((state: RootState) => state.notify)
    const {theme} = useAppSelector((state: RootState) => state.notify)



    useEffect(() => {
        socket.emit("checkUserOnline", auth)
    }, [socket,auth])

    const [search, setSearch] = useState("")
    const [searchUsers, setSearchUsers] = useState([])

    const onHandleSearch = async (e: SyntheticEvent) => {
        e.preventDefault()
        const {success} = await fetchDataApi.getData(`search?username=${search}`, token!)
        const searchUsers = success.users.filter((e: UserState) => e._id !== auth._id)
        if (success) setSearchUsers(searchUsers)
    }
    const onHandlerAddUser = (user: ChatUsersState) => {
        dispatch(addMessageUsers({user}))
        navigate(`/message/${user._id}`)
        setSearch("")
        setSearchUsers([])
    }
    const isActive = (user: ChatUsersState) => {
        if ( online.includes(user._id)) return s.leftSide_active_icon
        return ""
    }


    useEffect(() => {
        let mounded = true
        if (mounded) {
            fetchDataApi.getData('conversation', token!)
                .then(({success}) => {
                    success.conversation.forEach((item: any) => {
                        item.recipients.forEach((cv: any) => {
                            if (cv._id !== auth._id) {
                                dispatch(setConversation(
                                    {
                                        result: success.result,
                                        data: {...cv, text: item.text, media: item.media}!
                                    }))
                            }
                        })
                    })
                })
        }

        return () => {mounded = false}

    }, [firstLoad, id])




    return (
        <>
            <form onSubmit={onHandleSearch} className={clsx(s.leftSide_form,
                theme === "light" && s.left_side_theme
                )}
            >
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Enter to Search..."
                />
                <button type="button">
                    Search
                </button>
            </form>


            {searchUsers?.length !== 0 ? (
                <>
                    {searchUsers?.map((user: ChatUsersState, index: number) => (
                        <div key={`${user._id}_${index}`} onClick={() => onHandlerAddUser(user)}>
                            <UserCard className={s.users_styles}  {...user as any} />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {users?.map((user: ChatUsersState, index: number) => (
                        <div key={`${user._id}_${index}`} onClick={() => onHandlerAddUser(user)}>
                            <UserCard {...user as any} className={clsx(s.users_styles, s.leftSide_icon, isActive(user))}>
                                <span role="icon"><GoPrimitiveDot/></span>
                            </UserCard>
                        </div>
                    ))}
                </>
            )}
        </>
    );
};

export default LeftSide;