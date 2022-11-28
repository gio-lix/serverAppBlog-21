import React from 'react';
import {Outlet, Navigate} from "react-router-dom";

const PrivateRouter = () => {
    let firstLogin = localStorage.getItem("firstLogin")
    return !!firstLogin ? <Outlet /> : <Navigate to="/" />
};

export default PrivateRouter;