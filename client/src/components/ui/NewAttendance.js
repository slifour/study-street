import React, { useState, useContext, useCallback, useEffect } from "react";
import styles from './checklist.module.css'
import uniqueString from 'unique-string';

import { LoginUserContext } from '../../App';
import { ReloadContext } from "../request/ReloadContext";
import useRequest from '../request/useRequest';

export default function NewAttendance(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {setReloadTime} = useContext(ReloadContext);

    const [date, setDate] = useState('');
    const [dates, setDates] = useState([]);
    const [isProper, setIsProper] = useState(true);
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        request();
    }, [])

    const onResponseOK = useCallback(({payload}) => {
        setReloadTime(new Date());
        setDates(payload[1]);
    }, [setReloadTime]);

    const onResponseFail = useCallback(({payload}) => {
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        quest: {
            questID: `${uniqueString()}`,
            type: "Attendance",
            content: `${modifyDateString(date)}`,
            contentDate: new Date(date),
            acceptedUsers: [loginUser.userID],
            doneUsers: [],
            participatingUsers : [],
            notYetUsers: [loginUser.userID]
        }
    }), [date]);

    const modifyDateString = (dateString) => {
        let resultString = '';

        if (dateString.slice(5, 6) != '0'){
            resultString += dateString.slice(5, 6);
        }
        resultString += `${dateString.slice(6, 7)}/`;
        if (dateString.slice(8, 9) != '0'){
            resultString += dateString.slice(8, 9);
        }
        resultString += `${dateString.slice(9, 10)} `;
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
        let currentDate = new Date(e.target.value);
        let todayDate = new Date();
        let tempProper = true;
        dates.forEach(d => {
            let compareDate = new Date(d);
            if ((compareDate.getDate() === currentDate.getDate()) &&
                (compareDate.getMonth() === currentDate.getMonth())) {
                    tempProper = false;
            }
        })
        if (todayDate >= currentDate) {
            tempProper = false;
            setIsPast(true);
        } else {
            setIsPast(false);
        }
        setIsProper(tempProper);
        setDate(e.target.value);
    }

    const onCreate = () => {
        props.callClose();
        //**socket** add new attendance
        request();
        props.callUpdate();
    }

    return(
        <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>New Attendance</div>
            </div>
            <div className={styles.divider}></div>
            {(!isProper && !isPast) &&
                <div>
                    <div className={styles.groupGoalInstructionSmall}>
                        <div className={styles.iconsWhite}>campaign</div>
                        <div className={styles.groupGoalInstructionContent}>
                            You already have an attendance at same day.
                        </div>
                    </div>
                </div>
            }
            {(!isProper && isPast) &&
                <div>
                    <div className={styles.groupGoalInstructionSmall}>
                        <div className={styles.iconsWhite}>campaign</div>
                        <div className={styles.groupGoalInstructionContent}>
                            You have chosen date already past.
                        </div>
                    </div>
                </div>
            }
            <div className={styles.modalContent}>
                <div className={styles.modalContentText}>Date</div>
                <form>
                    <input
                        type="date"
                        className={styles.picker}
                        onChange={changeDate}
                    ></input>
                </form>
            </div>
            <div className={styles.modalFooter}>
                <div className={styles.cancelButton} onClick={props.callClose}>Cancel</div>
                { (date.toString() !== '') && (isProper) &&
                    <div className={styles.createButton} onClick={()=>onCreate()}>Create</div>
                }
                { ((date.toString() === '') ||
                    ((date.toString() !== '') && (!isProper))) &&
                    <div className={styles.createButtonDisabled}>Create</div>
                }
            </div>
        </div>
    )
}