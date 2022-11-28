import React, {useEffect} from 'react';
import moment from "moment";
import clsx from "clsx";

import {NavLink} from "react-router-dom";

import {IoMdNotificationsOff, IoIosNotifications} from "react-icons/io"
import {MdNotificationAdd} from "react-icons/md"
import {GoPrimitiveDot} from "react-icons/go"

import {RootState, useAppDispatch, useAppSelector} from "../redux/store";
import {NotifyPostsState} from "../typing";
import {fetchDataApi} from "../api/postDataApi";
import {setDeleteAll, setSound, setUpdatePostNotify} from "../redux/slices/postNotifySlice";


const NotifyModel = () => {
    const dispatch = useAppDispatch()

    const {posts, sound} = useAppSelector((state: RootState) => state.postNotify)
    const {token} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)


    const onHandleDelete = async () => {
        const {success} = await fetchDataApi.deleteData(`deleteAllNotify`, token!)
        if (success) dispatch(setDeleteAll())
    }

    const onHandleIsReady = async (id: string) => {
        const {success} = await fetchDataApi.updateData(`isReadyNotify/${id}`, token!)
        if (success) dispatch(setUpdatePostNotify(success.notifies))
    }






    return (
        <>
            <div className={clsx("notify", theme === "light" && "notify_theme")}>
                <h3>Notification</h3>
                {sound ? (
                    <span onClick={() =>   dispatch(setSound(false))} className="notify_on">
                        <IoIosNotifications/>
                    </span>
                ) : (
                    <span onClick={() =>   dispatch(setSound(true))} className="notify_off">
                        <IoMdNotificationsOff/>
                    </span>
                )}
            </div>
            <section className="notify_body">
                {posts.length === 0 ? (
                    <span>
                        <MdNotificationAdd/>
                    </span>
                ) : (
                    <div>
                        <div className={clsx("notify_body_items")}>
                            {posts?.map((item: NotifyPostsState, index: number) => {
                                return (
                                    <NavLink
                                        onClick={() => onHandleIsReady(item._id)}
                                        className={clsx("notify_navLink", theme === "light" && "notify_navLink_theme")}
                                        to={`${item?.url}`}
                                        key={`${item?.id}_${index}`}
                                    >
                                        <div className="notify_navLink_head">
                                            <article>
                                                <img src={item?.user.avatar} alt="avatar"/>
                                                <strong>{item?.user.username}</strong>
                                            </article>
                                            <article>
                                                <span>{item?.text}</span>
                                                {item?.image && (
                                                    <img src={item?.image} alt="image"/>
                                                )}
                                            </article>
                                        </div>
                                        <div className="notify_navLink_footer">
                                            {item?.content && <small>{item?.content.slice(0, 25)} {"   "} ...</small>}
                                            <small>
                                                {moment(item?.createdAt).fromNow()}
                                                {!item?.isRead && <span> <GoPrimitiveDot/> </span>}
                                            </small>
                                        </div>
                                    </NavLink>
                                )
                            })}
                        </div>
                        <div className={clsx(
                            "notify_body_footer",
                            theme === "light" && "notify_body_footer_button_theme"
                        )}>
                            <p role="button" onClick={onHandleDelete}>delete all</p>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default NotifyModel;