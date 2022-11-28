import React, {FC} from 'react';

import s from "./Message.module.scss"

import {ChatUsersState, UserState} from "../../typing";
import {imageShow, videoShow} from "../../utils/mediaShow";
import {AiTwotoneDelete} from "react-icons/ai"

interface MessageState {
    createAt: string
    media: string[]
    recipients: string
    sender: string
    text: string
}

interface Props {
    user: UserState | ChatUsersState
    msg: MessageState
}


const MessageDisplay: FC<Props> = ({user, msg}) => {

    return (
        <>
            <div className={s.chat_title}>
                <img src={user?.avatar} alt="avatar"/>
                <span>{user?.username}</span>
            </div>

            <div className={s.msgDisplay_img_box}>
                {msg.media.map((img, index: number) => (
                    <div className={s.msgDisplay_img} key={index}>
                        {
                            img.match(/video/i)
                                ? videoShow(img)
                                : imageShow(img)
                        }
                    </div>
                ))}
            </div>
            <div className={s.chat_text}>
                {msg.text}
            </div>
            <div className={s.chat_time}>
                {new Date(msg.createAt).toLocaleString()}
            </div>
        </>
    );
};

export default MessageDisplay;