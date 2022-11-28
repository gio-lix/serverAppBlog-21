import React from 'react';
import LeftSide from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";
import {RootState, useAppSelector} from "../../redux/store";
import clsx from "clsx";

const Conversation = () => {
    const {theme} = useAppSelector((state: RootState) => state.notify)


    return (
        <main className={clsx("message", theme === "light" && "message_theme")}>
            <section>
                <LeftSide />
            </section>
            <section >
                <RightSide />
            </section>
        </main>
    );
};

export default Conversation;