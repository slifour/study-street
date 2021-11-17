import React, { useState, useContext, useCallback } from "react";
import styles from './checklist.module.css'
import uniqueString from 'unique-string';

import { LoginUserContext } from '../../App';
import { ReloadContext } from "../request/ReloadContext";
import useRequest from '../request/useRequest';

export default function NewGoal(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {setReloadTime} = useContext(ReloadContext);

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);

    const onResponseOK = useCallback(({payload}) => {
        setReloadTime(new Date());
    }, [setReloadTime]);

    const onResponseFail = useCallback(({payload}) => {
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        quest: {
            questID: `${uniqueString()}`,
            type: "Goal",
            content: `${modifyDateString(hour, minute)}`,
            acceptedUsers: [loginUser.userID],
            doneUsers: [],
            participatingUsers : [],
            notYetUsers: [loginUser.userID]
        }
    }), [hour, minute]);

    const modifyDateString = (hourString, minuteString) => {
        let resultString = '';
        resultString += `${hourString} hours ${minuteString} mins`
        return resultString;
    }

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_NEW_QUEST",
        responseType: "RESPONSE_NEW_QUEST",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    const changeHour = (e) => {
        setHour(e.target.value);
    }

    const changeMinute = (e) => {
        setMinute(e.target.value);
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
                <div className={styles.modalTitle}>New Goal</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.modalContent}>
                <form className={styles.modalForm}>
                    <input
                        type="number"
                        min="0"
                        max="23"
                        placeholder="0"
                        className={styles.picker}
                        onChange={changeHour}
                    ></input>
                </form>
                <div className={styles.modalContentText}>hour</div>
                <form className={styles.modalForm}>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        className={styles.picker}
                        onChange={changeMinute}
                    ></input>
                </form>
                <div className={styles.modalContentText}>minute</div>
            </div>
            <div className={styles.modalFooter}>
                <div className={styles.cancelButton} onClick={props.callClose}>Cancel</div>
                <div className={styles.createButton} onClick={()=>onCreate()}>Create</div>
            </div>
        </div>
    )
}