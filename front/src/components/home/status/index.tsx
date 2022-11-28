import React from 'react';
import clsx from "clsx";

import s from "./Status.module.scss"

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";

import {setModal} from "../../../redux/slices/postsSlice";


const Status = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    return (
        <>
            <section className={s.status}>
                <div className={clsx(s.status_box, theme === "light" && "background_theme")}>
                    <img src={user?.avatar} alt="avatar"/>
                    <button
                        className={clsx(s.button, theme === "light" && s.button_dark)}
                        onClick={() => dispatch(setModal(true))}
                    >
                        {user?.username}, what are you thinking?
                    </button>
                </div>
            </section>
        </>

    );
};

export default Status;