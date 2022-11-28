import React from 'react';
import clsx from "clsx";

import s from "./Header.module.scss"

import {RootState, useAppSelector} from "../../../redux/store";
import Search from "../search";
import Menu from "../menu";

const Header = () => {
    const {theme} = useAppSelector((state: RootState) => state.notify)

    return (
        <header className={clsx(s.header, theme === "light" && s.header_theme)}>
            <p onClick={() => window.scrollTo({top: 0})} className={s.header_logo}>Logo</p>
            <Search />
            <Menu />
        </header>
    );
};

export default Header;