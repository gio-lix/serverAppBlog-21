import React, {FC,  useState} from 'react';
import clsx from "clsx";


interface Props {
    setContent?: any
    content?: string
    className?: string
}

const reactions = [
    '❤️', '😆', '😯', '😢', '😡', '👍', '👎', '😄',
    '😂', '😍', '😘', '😗', '😚', '😳', '😭', '😓',
    '😤', '🤤', '👻', '💀', '🤐', '😴', '😷', '😵'
]

const Icons:FC<Props> = ({content,className,setContent}) => {
    const [openIcon, setOpenIcon] = useState(false)
    // const userIconRef = useRef<HTMLDivElement | null>(null)


    // const handleClick = (e: any) => {
    //     e.preventDefault()
    //     if (!e.path.includes(userIconRef.current)) {
    //         setOpenIcon(false)
    //     }
    // }
    // useEffect(() => {
    //     window.addEventListener("click", handleClick)
    //     return () => window.removeEventListener("click", handleClick)
    // }, [userIconRef.current])


    return (
        <aside className="icons">
            <div
                // ref={userIconRef}
                role='button' onClick={() => setOpenIcon(!openIcon)}>
                😆
            </div>
            {openIcon && (
                <div className={clsx("icons_box", className)}>
                    { reactions.map((icon) => (
                        <span
                            onClick={() => {
                                setContent((prev: any) => prev + icon)
                                setOpenIcon(false)
                            }}
                            role="icon" key={icon}>
                          {icon}
                        </span>
                    ))}
                </div>
            )}
        </aside>
    );
};

export default Icons;