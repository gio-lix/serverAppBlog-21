import React from 'react';

import Toast from "./toast";

import {RootState, useAppDispatch, useAppSelector} from "../../redux/store";
import {setNotifyReset} from "../../redux/slices/notifySlices";

const Notify = () => {
    const dispatch = useAppDispatch()
    const {notify} = useAppSelector((state: RootState) => state.notify)

    return (
        <div>
            {(notify.error) &&
                <Toast
                    message={{title: "Error", body: notify.error}}
                    bgColor={"#ce0101"}
                    handleShow={() => dispatch(setNotifyReset())}
                />
            }
            {(notify.success) &&
                <Toast
                    message={{title: "Success", body: notify.success}}
                    bgColor={"#ADFF2FFF"}
                    handleShow={() => dispatch(setNotifyReset())}
                />
            }
        </div>
    );
};

export default Notify;