import React, {FC, SyntheticEvent, useEffect, useState} from 'react';
import clsx from "clsx";

import s from "./EditProfile.module.scss"

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {imageUpload} from "../../../utils/ImageUploaded";
import {setUpdateUser} from "../../../redux/slices/authSlices";
import {fetchDataApi} from "../../../api/postDataApi";
import {IMAGES} from "../../../images";
import {UpdateUserState} from "../../../typing";

interface Props {
    setOnEdit: Function
    setCount: Function
}

const initialState = {
    fullname: "",
    mobile: "",
    address: "",
    website: "",
    story: "",
    gender: "",
    avatar: ""
}
type State = typeof initialState


const EditProfile: FC<Props> = ({setOnEdit, setCount}) => {
    const dispatch = useAppDispatch()

    const {token, user} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)

    const [avatarImage, setAvatarImage] = useState<any>()
    const [uploadImage, setUploadImage] = useState<any>()
    const [imageLoading, setImageLoading] = useState<boolean>(false)
    const [userData, setUserData] = useState<State>(initialState)

    const {website, address, fullname, mobile, avatar, gender, story} = userData

    useEffect(() => {
        setUserData(user!)
    }, [user])


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target
        setUserData({...userData, [name]: value})
    }

    const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) return
        const file = e.target.files[0]
        setImageLoading(true)

        try {
            const {success} = await imageUpload(file)
            setUploadImage((success as any).url)
            setImageLoading(false)
            setAvatarImage(file)
        } catch (err) {
            console.log(err)
        }
    };


    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault()

        const user:UpdateUserState= {website, address, avatar: uploadImage, fullname, mobile, gender, story}

        setCount((prev: number) => prev + 1)
        dispatch(setUpdateUser({user}))
        const {success} = await fetchDataApi.updateData('user', token!, user)
        if (success) {
            setOnEdit(false)
        }

    }


    return (
        <section className={clsx(s.edit, theme === "light" ? s.theme_dark : "")}>
            <button
                onClick={() => setOnEdit(false)}
                className={s.close}
            >
                &times;
            </button>
            <form onSubmit={handleSubmit}>
                <div className={s.images_group}>
                    <figure className={s.image}>
                        {imageLoading ? (
                            <div className={s.loading_image}>
                                <img src={IMAGES.spinner} alt="spinner"/>
                            </div>
                        ) : (
                            <img
                                src={avatarImage ? URL.createObjectURL(avatarImage) : avatar && avatar}
                                alt="profile"
                            />
                        )}

                        {/*<figcaption>Change</figcaption>*/}
                    </figure>
                    <label htmlFor="file" role="button">
                        Load file
                        <input
                            type="file"
                            accept="image/*"
                            name="file"
                            id="file"
                            hidden
                            onChange={handleChangeFile}
                        />
                    </label>

                </div>
                <div className={s.input_group}>
                    <label htmlFor="fullname">Full Name</label>
                    <input
                        type="text"
                        id="fullname"
                        name="fullname"
                        value={fullname}
                        onChange={handleChangeInput}
                        className={s.fullname}
                    />
                    <small className={s.fullname_cunt}>
                        {fullname.length} / 25
                    </small>
                </div>
                <div>
                    <label htmlFor="mobile">Mobile</label>
                    <input
                        type="number"
                        id="mobile"
                        name="mobile"
                        value={mobile}
                        onChange={handleChangeInput}
                    />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={handleChangeInput}
                    />
                </div>
                <div>
                    <label htmlFor="website">Website</label>
                    <input
                        type="text"
                        id="website"
                        name="website"
                        value={website}
                        onChange={handleChangeInput}
                    />
                </div>
                <div>
                    <label htmlFor="story">Story</label>
                    <textarea
                        name="story"
                        value={story}
                        onChange={handleChangeInput}
                        cols={30}
                        rows={4}
                    />
                    <small className={s.textarea_count}>{story.length} / 200</small>
                </div>
                <div>
                    <label htmlFor="gender">Gender</label>
                    <select
                        onChange={handleChangeInput}
                        value={gender}
                        name="gender"
                        id="gender"
                    >
                        <option value="male">male</option>
                        <option value="female">female</option>
                        <option value="other">other</option>
                    </select>
                </div>
                <button disabled={imageLoading} type="submit" className={s.save_button}>Save</button>
            </form>
        </section>
    );
};

export default EditProfile;