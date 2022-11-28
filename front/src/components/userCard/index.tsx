import React, {FC} from 'react';
import clsx from "clsx";

import {BsImageFill} from "react-icons/bs"

import s from "./Username.module.scss"

import {RootState, useAppSelector} from "../../redux/store";
import {UserState} from "../../typing";

interface UserProps extends UserState {
    text?: string
    media?: string
}

interface Props extends UserProps  {
    children?: React.ReactNode
    handleLink?: React.MouseEventHandler<HTMLHeadingElement> | undefined
    className?: string
}


const UserCard: FC<Props> = ({
                                 _id,
                                 username,
                                 avatar,
                                 text,
                                 media,
                                 children,
                                 handleLink,
                                 className
                             }) => {

    const {theme} = useAppSelector((state: RootState) => state.notify)




    return (
        <section className={clsx(s.user, className ? className : "", theme === "light" && s.user_theme)}>
            <div>
                <figure>
                    <img className={s.img} src={avatar} alt="avatar"/>
                </figure>
                <h2 onClick={handleLink}>
                    <p> {username}</p>
                    <p> {text && <span>{text}</span>}</p>
                    <p>
                        {media!?.length > 0 && (
                            <>
                                <span>
                                {media!?.length}
                                </span>
                                <span>
                                     <BsImageFill style={{color: "black"}}/>
                                </span>
                            </>
                        )}
                    </p>
                </h2>
            </div>
            <div>
                {children}
            </div>
        </section>
    );
};

export default UserCard;