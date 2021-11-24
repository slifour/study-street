
import React, { useState, useContext, useCallback } from 'react';
import styles from './checklist.module.css'
import styled from 'styled-components';

import { LoginUserContext } from '../../App';
import { ReloadContext } from "../request/ReloadContext";
import useRequest from '../request/useRequest';
import UserAvatarCircle from './UserAvatarCircle';

const GaugeBox = styled.div`
    position : absolute;
    width : 100%;
    height : ${props => props.height};
    background: rgba(255, 255, 255, 0.7);
`

export default function SingleQuest(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {setReloadTime} = useContext(ReloadContext);
    const [isAccepted, setAccepted] = useState(props.isAccepted);
    const [expand, setExpand] = useState(false);

    //**socket related functions**
    const onResponseOK = useCallback(({payload}) => {
        setReloadTime(new Date());
      }, [setReloadTime]);

    const onResponseFail = useCallback(({payload}) => {
    }, []);

    const makePayload = useCallback(() => ({
        questID: props.questID,
        userID: loginUser.userID
    }), [loginUser.userID]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_ACCEPT_QUEST",
        responseType: "RESPONSE_ACCEPT_QUEST",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    const getHeader = () => {
        if (isAccepted) {
            return styles.groupGoalBoxHeaderExpandable;
        } else {
            return styles.groupGoalBoxHeader;
        }
    }

    const handleExpand = () => {
        if (isAccepted) {
            setExpand(!expand)
        }
    }
    
    const handleAccept = () => {
        setAccepted(true)
        setExpand(true)
        //socket emit
        request();
    }

    const getIcon = () => {
        if (props.type === 'Attendance') {
            return 'calendar_today'
        } else {
            return 'flag'
        }
    }

    const getDirection = () => {
        if (expand) {
            return styles.iconsExpand;
        } else {
            return styles.icons;
        }
    }

    return (
        <div className = {styles.groupGoalBox}>
            <div
                className={getHeader()}
                onClick = {() => handleExpand()}
            >
                <div className = {styles.bookGauge}>
                    <div className = {styles.gaugeContainer}>
                        <GaugeBox height={`${100-props.percentGauge}%`}></GaugeBox>
                        <img src = "assets/images/bookArtifact.png"></img>
                    </div>
                    <div className={styles.textGauge}>{`${props.percentGauge}%`}</div>
                </div>
                <div className={styles.goalContent}>
                    <div className={styles.icons}>{getIcon()}</div>
                    <div className={styles.textTitle}>{props.type}</div>
                    <div className={styles.textContent}>{props.content}</div>
                </div>
                { !isAccepted && props.isNumOfGoalZero &&
                    <div
                        className = {styles.accept}
                        onClick = {() => handleAccept()}
                    >Accept</div> }
                { !isAccepted && !(props.isNumOfGoalZero) &&
                    <div
                        className = {styles.already}
                    >Already{`\n`}have a goal</div> }
                { isAccepted &&
                    <div className={styles.drop}>
                        <div 
                            className = {getDirection()}
                        >expand_more</div>
                    </div>
                }
            </div>
            {isAccepted && expand && <div className={styles.groupGoalBoxContent}>
                    <div className={styles.divider}></div>
                        {(Object.keys(props.doneUsers).length !== 0) &&
                            <div className={styles.groupParticipationBox}>
                                <div className={styles.doneTag}>Done</div>
                                <div className={styles.tagText}>
                                    {Object.keys(props.doneUsers).length}
                                </div>
                                <div className = {styles.horizontalAvatarList}>
                                    {
                                    Object.values(props.doneUsers).map(user => {
                                        return <UserAvatarCircle user = {user} size={40} onMouseEnterItem = {user.userName}/>
                                    })
                                    }
                                </div>
                            </div>
                        }
                        {(Object.keys(props.participatingUsers).length !== 0) &&
                            <div className={styles.groupParticipationBox}>
                                <div className={styles.participatingTag}>Participating</div>
                                <div className={styles.tagText}>
                                    {Object.keys(props.participatingUsers).length}
                                </div>
                                <div className = {styles.horizontalAvatarList}>
                                    {
                                    Object.values(props.participatingUsers).map(user => {
                                        return <UserAvatarCircle user = {user} size={40} onMouseEnterItem = {user.userName}/>
                                    })
                                    }
                                </div>
                            </div>
                        }
                        {(Object.keys(props.notYetUsers).length !== 0) &&
                            <div className={styles.groupParticipationBox}>
                                <div className={styles.yetTag}>Not Yet</div>
                                <div className={styles.tagText}>
                                    {Object.keys(props.notYetUsers).length}
                                </div>
                                {/** Show Avatar List */}
                                <div className = {styles.horizontalAvatarList}>
                                    {
                                    Object.values(props.notYetUsers).map(user => {
                                        return <UserAvatarCircle user = {user} size={40} onMouseEnterItem = {user.userName}/>
                                    })
                                    }
                                </div>
                            </div>
                        }
                </div>}
        </div>
    )
}