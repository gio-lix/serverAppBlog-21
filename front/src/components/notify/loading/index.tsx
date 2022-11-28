import React from 'react';
import s from "./Loading.module.scss"

const Loading = () => {
    return (
        <section className={s.root}>
            <p>Loading</p>
            <div className={s.loading}>
                <div className={s.circle}></div>
                <div className={s.circle}></div>
            </div>
        </section>
    );
};

export default Loading;