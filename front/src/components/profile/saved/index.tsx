import React, {FC, useEffect} from 'react';
import {useParams} from "react-router-dom";

import {RootState, useAppDispatch, useAppSelector} from "../../../redux/store";
import {getSavedPostApi} from "../../../redux/slices/postSavedSlice";
import {IMAGES} from "../../../images";

import PostContainer from "../postContainer";
import LoadButton from "../../LoadButton";


interface Props {
    load: any
    page: any
    result: number
    handleLoadMore: Function
}

const Saved: FC<Props> = ({result, page, handleLoadMore, load}) => {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const {token} = useAppSelector((state: RootState) => state.auth)
    const {posts, status} = useAppSelector((state: RootState) => state.savedPosts)


    useEffect(() => {
        dispatch(getSavedPostApi({token}))
    }, [id])


    return (
        <PostContainer status={status === "loading"} posts={posts!}>
            <div className="d-flex j-c-center a-i-center">
                {load ? (
                    <div style={{marginTop: "30px"}}>
                        <img src={IMAGES.spinner} alt="spinner"/>
                    </div>
                ) : (
                    <LoadButton
                        result={result}
                        handleLoadMore={handleLoadMore}
                        page={page}
                        load={load}
                    />
                )}
            </div>
        </PostContainer>
    );
};

export default Saved;