import React, {useEffect} from 'react';
import {Routes, Route} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import clsx from "clsx";

import {RootState, useAppDispatch, useAppSelector} from "./redux/store";
import {refreshDataApi} from "./redux/slices/authSlices";

import PrivateRouter from "./customRouter/PrivateRouter";
import PageRender from "./customRouter/PageRender";
import Register from "./pages/account/register";
import NotFound from "./components/NotFound";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/account/login";
import Notify from "./components/notify";
import PostPage from "./pages/post/[id]";
import Home from "./pages/home";


function App() {
    const dispatch = useAppDispatch()

    const {theme} = useAppSelector((state: RootState) => state.notify)
    const firstLogin = localStorage.getItem("firstLogin")

    useEffect(() => {
        if (firstLogin) {
            dispatch(refreshDataApi())
        }
    }, [firstLogin, dispatch])

    useEffect(() => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {}
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {}
            });
        }
    },[])


    return (
        <main className={clsx('container', theme === "light" ? "dark_theme" : "light_theme")}>
            <Notify/>
            <Routes>
                <Route path="/" element={<AppLayout/>}>
                    <Route path="login" element={<Login/>}/>
                    <Route path="register" element={<Register/>}/>
                </Route>
                <Route path="/" element={<AuthLayout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="post/:id" element={<PostPage/>}/>
                    <Route element={<PrivateRouter/>}>
                        <Route path=":page" element={<> <PageRender/> </>}/>
                        <Route path=":page/:id" element={<> <PageRender/> </>}/>
                    </Route>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </main>
    );
}

export default App;
