import React from "react";

export const imageShow = (src: any) => {
    return (
        <img
            style={{width: "100%", height: "100%", objectFit: "cover"}}
            src={src}
            alt=""
        />
    )
}
export const videoShow = (src: any) => {
    return (
        <video
            style={{width: "100%", height: "100%", objectFit: "cover"}}
            controls
            src={src}
        />
    )
}