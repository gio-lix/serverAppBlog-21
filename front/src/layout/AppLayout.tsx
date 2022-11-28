import React, {useEffect} from 'react';
import {Outlet} from "react-router-dom"
import {useNavigate} from "react-router-dom"

import {RootState, useAppSelector} from "../redux/store";

const AppLayout = () => {
    const navigate = useNavigate()

    const firstLogin = localStorage.getItem("firstLogin")
    const {token} = useAppSelector((state: RootState) => state.auth)

    useEffect(() => {
        (async () => {
            try {
                if (firstLogin) {
                    if (token) {
                        navigate("/")
                    } else {
                        navigate("/login")
                    }
                }
            } catch (err) {
                console.log("error - > ", err);
            }
        })()
    }, [token])

    return (
        <section className="main-container">
            <Outlet/>
        </section>
    );
};

export default AppLayout;