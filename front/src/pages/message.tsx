import React from 'react';

import {BsMessenger} from "react-icons/bs"

import LeftSide from "../components/message/LeftSide";
import {RootState, useAppSelector} from "../redux/store";
import clsx from "clsx";


const Message = () => {
    const {theme} = useAppSelector((state: RootState) => state.notify)


    return (
        <main  className={clsx("message", theme === "light" && "message_theme")}>
            <section>
                <LeftSide />
            </section>
            <section className='message_right_body'>
                <p className="messenger">
                    <BsMessenger />
                    <span>Messenger</span>
                </p>
            </section>
        </main>
    );
};

export default Message;