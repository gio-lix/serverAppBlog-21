import React, {useEffect, useState} from 'react';
import {RootState, useAppDispatch, useAppSelector} from "../redux/store";

import {getPosts, setLoadPosts} from "../redux/slices/postsSlice";
import {fetchDataApi} from "../api/postDataApi";
import {IMAGES} from "../images";

import RightSideBar from "../components/rightSide_bar/rightsideBar";
import LoadButton from "../components/LoadButton";
import Status from "../components/home/status";
import Posts from "../components/home/posts";


const Home = () => {
    const dispatch = useAppDispatch()

    const {result, status, pages} = useAppSelector((state: RootState) => state.posts)
    const {token} = useAppSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (token) dispatch(getPosts({token}))
    }, [token])


    const onHandleClickLoad = async () => {
        setLoading(true)
        const {success} = await fetchDataApi.getData(`posts?page=${pages}`, token!)
        if (success) {
            dispatch(setLoadPosts(success))
            setLoading(false)
        }
    }


    return (
        <main>
            <Status/>
            <div className="grid_home">
                {(result === 0 && status === "loaded")
                    ? <h1>No Posts</h1>
                    : <Posts/>
                }
                <RightSideBar/>
            </div>
            <div className="spinner_center">
                {loading ? (
                    <img src={IMAGES.spinner} alt="spinner"/>
                ) : (
                    <LoadButton
                        result={result}
                        handleLoadMore={onHandleClickLoad}
                        page={pages}
                        load={loading}
                    />
                )}
            </div>

        </main>
    );
};

export default Home;