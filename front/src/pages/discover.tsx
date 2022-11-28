import React, {useEffect, useState} from 'react';

import {RootState, useAppDispatch, useAppSelector} from "../redux/store";
import {getDiscoveryPostApi, setDiscoveryPosts} from "../redux/slices/postsSlice";
import {IMAGES} from "../images";
import {fetchDataApi} from "../api/postDataApi";

import Posts from "../components/profile/posts";



const Discover = () => {
    const dispatch = useAppDispatch()

    const {token} = useAppSelector((state: RootState) => state.auth)
    const {discoveryPosts, status} = useAppSelector((state:RootState) => state.posts)

    const [loading, setLoading] = useState("loading")


    useEffect(() => {
        let mounted = true
        if (mounted) {
            setLoading("loading")
            fetchDataApi.getData(`post_discover`, token!)
                .then(({success}) => dispatch(setDiscoveryPosts(success)))
                .finally(() => setLoading("loaded"))
        }

        return () => {mounted = false}
    },[token])

    const handleLoadMore = async () => {
        dispatch(getDiscoveryPostApi({page: discoveryPosts.page, token}))
    }


    return (
        <section>
            {loading === "loading" ? (
                <div className="loading">
                    <img src={IMAGES.spinner} alt="spinner"/>
                </div>
            ) : (
                <Posts
                    profilePosts={discoveryPosts}
                    status={status}
                    load={status === "loading"}
                    handleLoadMore={handleLoadMore}
                />
            )}
        </section>
    );
};

export default Discover;