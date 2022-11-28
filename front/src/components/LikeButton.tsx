import React, {FC} from 'react';
import {FiHeart} from "react-icons/fi"
import {FaHeart} from "react-icons/fa"

interface Props {
    like: boolean
    handleUnlike: () => void
    handleLike: () => void
}

const LikeButton:FC<Props> = ({like,handleLike,handleUnlike}) => {
    return (
        <>
            {like
                ? <span onClick={() => handleUnlike()}> <FaHeart /></span>
                : <span onClick={() => handleLike()} > <FiHeart  /></span>
            }
        </>
    );
};

export default LikeButton;