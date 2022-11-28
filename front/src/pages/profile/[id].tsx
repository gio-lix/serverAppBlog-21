import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import clsx from "clsx";

import {setProfilePosts, setProfilePostsPosts} from "../../redux/slices/authSlices";
import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {setAddSavedPosts} from "../../redux/slices/postSavedSlice";
import {fetchDataApi} from "../../api/postDataApi";

import Info from "../../components/profile/info";
import Posts from "../../components/profile/posts";
import Saved from "../../components/profile/saved";


const Profile = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()

    const {profilePosts, token, user} = useAppSelector((state: RootState) => state.auth)
    const {theme} = useAppSelector((state: RootState) => state.notify)
    const {result, page} = useAppSelector((state: RootState) => state.savedPosts)

    const [loading, setLoading] = useState("loaded")
    const [saveTab, setSaveTab] = useState(false)
    const [load, setLoad] = useState(false)


    const handleLoadMore = async () => {
        setLoad(true)
        const {success} = await fetchDataApi.getData(`user_post/${id}?page=${profilePosts.page}`, token!)
        if (success) {
            dispatch(setProfilePosts(success))
            setLoad(false)
        }
    }
    const handleLoadMoreSavedPost = async () => {
        setLoad(true)
        const {success} = await fetchDataApi.getData(`getSavedPost?page=${profilePosts.page}`, token!)
        if (success) {
            dispatch(setAddSavedPosts({result: success.result, posts: success.savedPosts}))
            setLoad(false)
        }
    }


    useEffect(() => {
        let mounded = true
        if (!saveTab && mounded) {
            setLoading("loading")
            fetchDataApi.getData(`user_post/${id}`, token!)
                .then(({success}) => dispatch(setProfilePostsPosts(success)))
                .finally(() => {
                    setLoading("loaded")
                })
        }
        return () => {
            mounded = false
        }
    }, [saveTab])


    return (
        <section>
            <Info/>
            {user._id === id && (
                <div className='profile_tag'>
                    <button
                        onClick={() => setSaveTab(false)}
                        className={clsx(
                            saveTab ? "" : `active_tag ${theme === "light" && "profile_tag_theme_button_active"}`,
                            theme === "light" && "profile_tag_theme_button"
                        )}>Posts
                    </button>
                    <button
                        onClick={() => setSaveTab(true)}
                        className={clsx(
                            saveTab ?  `active_tag ${theme === "light" && "profile_tag_theme_button_active"}` : "",
                            theme === "light" && "profile_tag_theme_button"
                            )}>Save
                    </button>
                </div>
            )}
            {saveTab ? (
                <Saved
                    load={load}
                    page={page}
                    result={result}
                    handleLoadMore={handleLoadMoreSavedPost}
                />
            ) : (
                <Posts
                    load={load}
                    status={loading}
                    profilePosts={profilePosts}
                    handleLoadMore={handleLoadMore}
                />

            )}

        </section>
    );
};

export default Profile;