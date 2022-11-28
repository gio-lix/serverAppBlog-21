import React, {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import clsx from "clsx";

import s from "./Menu.module.scss"

import {AiFillCaretRight, AiFillHome} from "react-icons/ai";
import {TiLocationArrow} from "react-icons/ti";
import {RiCompassDiscoverFill} from "react-icons/ri";
import {IoMdNotificationsOff} from "react-icons/io";
import {AiTwotoneHeart} from "react-icons/ai";

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {setTheme} from "../../../redux/slices/notifySlices";
import NotifyModel from "../../NotifyModel";


const navLink = [
    {label: "Home", Icon: <AiFillHome/>, path: "/"},
    {label: "Message", Icon: <TiLocationArrow/>, path: "/message"},
    {label: "discover", Icon: <RiCompassDiscoverFill/>, path: "/discover"},
    {label: "Notify", Icon: <IoMdNotificationsOff/>, path: "/notify"},
]


const Menu = () => {
    const dispatch = useAppDispatch()
    const {pathname} = useLocation()
    const navigate = useNavigate()

    const {user, token} = useAppSelector((state: RootState) => state.auth)
    const {posts} = useAppSelector((state: RootState) => state.postNotify)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const useNotifyRef = useRef<HTMLLIElement | null>(null)
    const [postNotifyToggle, setPostNotifyToggle] = useState(false)


    const handleLogout = async () => {
        try {
            localStorage.removeItem("firstLogin")
            await axios.post("/api/logout")
            navigate("/login")
        } catch (err) {
            console.log("err - ")
        }
    }
    const isActive = (pn: string) => {
        if (pn === pathname) return s.active
    }

    const handleClick = (e: any) => {
        if (!e.path.includes(useNotifyRef.current)) {
            setPostNotifyToggle(false)
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [useNotifyRef.current])


    const onHandleTheme = () => {
        if (theme === "light") {
            dispatch(setTheme("dark"))
            localStorage.setItem("blog_theme", "dark")
        } else {
            dispatch(setTheme("light"))
            localStorage.setItem("blog_theme", "light")
        }
    }


    return (
        <>

            <nav className={clsx(s.menu,
                theme === "light" && s.menu_dark
            )}>
                <ul>
                    {navLink.map(item => (
                        <li key={item.label}>
                            <NavLink to={item.path} className={clsx(s.icons + " " + `${isActive(item.path)}`)}>
                                {item.Icon}
                            </NavLink>
                        </li>
                    ))}
                    <li className={s.heart}>
                        <span ref={useNotifyRef} onClick={() => setPostNotifyToggle(!postNotifyToggle)}>
                            <AiTwotoneHeart/>
                        </span>
                        <span className={clsx(theme === "light" && s.theme_light_num)}>
                            {posts.length}
                        </span>
                        {postNotifyToggle && (
                            <div className={clsx(theme === "light" && s.drop_theme_notify)}>
                                <NotifyModel/>
                            </div>
                        )}
                    </li>
                    <li className={s.drop}>
                        {token ? <img style={{opacity: ".5"}} src={user?.avatar} alt="avatar"/> : "user"}
                        <span className={s.rotateActive}>
                            <AiFillCaretRight/>
                        </span>
                        <div className={clsx(s.down,
                            theme === "light" && s.drop_theme
                        )}>
                            <Link to={`/profile/${user?._id}`}>Profile</Link>
                            <button onClick={() => onHandleTheme()}>
                                {theme === "light" ? "Light mode" : "Dark mode"}
                            </button>
                            <Link onClick={handleLogout} to="/">logout</Link>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Menu;