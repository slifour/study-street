import React, {useState, useCallback, useContext} from 'react';
import styles from './checklist.module.css'

import { LoginUserContext } from '../../App';
import { ReloadContext } from "../request/ReloadContext";
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';

export default function SingleChecklist(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {setReloadTime} = useContext(ReloadContext);
    const [isDone, setDone] = useState(props.isDone);

    const getIconStyle = () => {
        if (isDone) {
            return styles.iconsGray;
        }
        return styles.icons;
    }

    const getIcon = () => {
        if (isDone) {
            return 'check_box'
        } 
        return 'check_box_outline_blank'
    }

    const getTextStyle = () => {
        if (isDone) {
            return styles.checklistContentDone;
        }
        return styles.checklistContent;
    }

    //no need of payload
    // const onResponseOK = useCallback(({payload}) => {
    //     setReloadTime(new Date());
    // }, [setReloadTime]);

    // const onResponseFail = useCallback(({payload}) => {
    // }, []);

    // const makePayload = useCallback(() => ({
    //     userID: loginUser.userID,
    //     checklistID: props.checklistID,
    //     isDone: isDone
    // }), [isDone]);

    // const [request, innerReloadTimeRef] = useRequest({
    //     requestType: "REQUEST_TOGGLE_CHECKLIST",
    //     responseType: "RESPONSE_TOGGLE_CHECKLIST",
    //     onResponseOK,
    //     onResponseFail,
    //     makePayload
    // });

    // useLiveReload({request, innerReloadTimeRef});

    const handleToggle = () => {
        setDone(!isDone);
        //socket emit
        // request();
    }

    return(
        <div className={styles.checklistBox} onClick = {()=>handleToggle()}>
            <div
                className = {getIconStyle()}
            >{getIcon()}</div>
            <div className={getTextStyle()}>{props.content}</div>
            {(props.groupParticipation !== '') &&
                <div className={styles.doneBox}>
                    <div className={styles.doneText}>{props.groupParticipation}</div>
                </div>
            }
        </div>
    )
}