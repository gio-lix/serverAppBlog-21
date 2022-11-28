import React, {useEffect, useState} from 'react';
import moment from "moment";
import {IoIosCall} from "react-icons/io";
import {MdCallEnd} from "react-icons/md";
import {BsFillCameraVideoFill} from "react-icons/bs";

import s from "./Message.module.scss"

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {setCallEnd} from "../../redux/slices/callSlice";
import clsx from "clsx";

const CallModel = () => {
    const dispatch = useAppDispatch()
    const {call} = useAppSelector((state: RootState) => state.call)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [answer, setAnswer] = useState<boolean>(false)

    const {msg} = call


    const [mins, setMins] = useState<number>(0)
    const [hours, setHours] = useState<number>(0)
    const [second, setSecond] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)


    useEffect(() => {
        const setTime = () => {
            setTotal((t: number) => t + 1)
            setTimeout(setTime, 1000)
        }
        setTime()
        return () => setTotal(0)
    },[])

    useEffect(() => {
        setSecond(total%60)
        setMins(parseInt(String(total / 60)))
        setHours(parseInt(String(total/3600)))
    },[total])


    const handleEndCall = () => {
        dispatch(setCallEnd())
    }


    useEffect(() => {
        if (answer) {
            setTotal(0)
        } else {
            const timer = setTimeout(() => {
                dispatch(setCallEnd())
            }, 15000)
            return () => clearTimeout(timer)
        }

    },[dispatch, answer])



    const handleAnswer = () => {
        setAnswer(true)
    }

    return (
        <div className={clsx(s.callModel, theme === "light" && s.callModel_theme)}>
            <div>
                    <img src={msg.avatar} alt="avatar"/>
                    <h4>{msg.username}</h4>
                    <h6>{msg.fullname}</h6>
                    <div className={s.calling}>
                        {
                            msg.video
                                ? <span>calling video...</span>
                                : <span>calling audio...</span>
                        }
                    </div>
                <div>
                    <span>{ hours.toString().length < 2 ? '0' + hours : hours }</span>
                    <span>:</span>
                    <span>{ mins.toString().length < 2 ? '0' + mins : mins }</span>
                    <span>:</span>
                    <span>{ second.toString().length < 2 ? '0' + second : second }</span>
                </div>

                <div  className={s.callModel_calling_buttons}>
                    <span role="button" onClick={handleEndCall}>
                        <MdCallEnd />
                    </span>
                    <>
                        {
                            msg.video
                                ? (
                                    <span onClick={handleAnswer}>
                                <BsFillCameraVideoFill />
                            </span>
                                )
                                : (
                                    <span>
                                 <IoIosCall />
                            </span>
                                )
                        }
                    </>
                </div>
            </div>
        </div>
    );
};

export default CallModel;