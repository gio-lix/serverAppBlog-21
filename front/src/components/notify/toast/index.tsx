import React, {FC} from 'react';

import s from "./Toast.module.scss"


interface Props {
    message?: any
    handleShow?: () => void
    bgColor?: string
}

const Toast: FC<Props> = ({handleShow, message, bgColor}) => {

    const fun = () => {
        if (message.body.length > 0) {
            let values = message.body?.map((e: any) => e)
            return values[0]
        }
    }


    return (
        <section className={s.root}>
            {message.body.length !== 0 && (
                <div style={{backgroundColor: bgColor}}>
                    <strong>{message?.title}</strong>
                    <button onClick={handleShow}>&times;</button>
                </div>
            )}

            {!!fun() && Object.values(fun())?.map((item: any, index: number) => {
                return (
                    <div key={index} style={{backgroundColor: bgColor}}>
                        <p>{item}</p>
                    </div>
                )
            })}
        </section>
    );
};

export default Toast;