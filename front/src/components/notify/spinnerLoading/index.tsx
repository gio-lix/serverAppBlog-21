import React from 'react';

import s from "./SpinnerLoading.module.scss"

import {IMAGES} from "../../../images";


const SpinnerLoading = () => {
    return (
        <section className={s.spinner}>
            <img src={IMAGES.spinner} alt="spinner"/>
        </section>
    );
};

export default SpinnerLoading;