import React, { useState, useContext, useCallback } from "react";
import styles from './checklist.module.css'
import uniqueString from 'unique-string';

import { LoginUserContext } from '../../App';
import { ReloadContext } from "../request/ReloadContext";
import useRequest from '../request/useRequest';

export default function NewAttendance(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {setReloadTime} = useContext(ReloadContext);

    const [date, setDate] = useState('');

    const onResponseOK = useCallback(({payload}) => {
        setReloadTime(new Date());
    }, [setReloadTime]);

    const onResponseFail = useCallback(({payload}) => {
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        quest: {
            questID: `${uniqueString()}`,
            type: "Attendance",
            content: `${modifyDateString(date)}`,
            acceptedUsers: [loginUser.userID],
            doneUsers: [],
            participatingUsers : [],
            notYetUsers: [loginUser.userID]
        }
    }), [date]);

    const modifyDateString = (dateString) => {
        console.log(dateString);
        let resultString = '';

        if (dateString.slice(5, 6) != '0'){
            resultString += dateString.slice(5, 6);
        }
        resultString += `${dateString.slice(6, 7)}/`;
        if (dateString.slice(8, 9) != '0'){
            resultString += dateString.slice(8, 9);
        }
        resultString += `${dateString.slice(9, 10)} `;

        if (dateString.slice(11, 12) != '0'){
            resultString += dateString.slice(11, 12);
        }
        resultString += `${dateString.slice(12, 13)}:`;
        resultString += `${dateString.slice(14, 16)}`;

        return resultString;
    }

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_NEW_QUEST",
        responseType: "RESPONSE_NEW_QUEST",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    const changeDate = (e) => {
        setDate(e.target.value);
    }

    const onCreate = () => {
        props.callClose();
        //**socket** add new attendance
        request();
        props.callUpdate();
    }

    return(
        <div>
            <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>New Attendance</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.modalContent}>
                <div className={styles.modalContentText}>Date</div>
                <form>
                    <input
                        type="datetime-local"
                        className={styles.picker}
                        onChange={changeDate}
                    ></input>
                </form>
            </div>
            <div className={styles.modalFooter}>
                <div className={styles.cancelButton} onClick={props.callClose}>Cancel</div>
                <div className={styles.createButton} onClick={()=>onCreate()}>Create</div>
            </div>
        </div>
    )
}