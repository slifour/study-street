import React, { useState } from 'react';
import styles from './checklist.module.css'
import styled from 'styled-components';

const GaugeBox = styled.div`
    position : absolute;
    width : 100%;
    height : ${props => props.height};
    background: rgba(255, 255, 255, 0.7);
`

export default function SingleQuest(props) {

    const [isAccepted, setAccepted] = useState(props.isAccepted);
    const [expand, setExpand] = useState(false);

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
                { !isAccepted && 
                    <div
                        className = {styles.accept}
                        onClick = {() => handleAccept()}
                    >Accept</div> }
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
                            </div>
                        }
                        {(Object.keys(props.participatingUsers).length !== 0) &&
                            <div className={styles.groupParticipationBox}>
                                <div className={styles.participatingTag}>Participating</div>
                                <div className={styles.tagText}>
                                    {Object.keys(props.participatingUsers).length}
                                </div>
                            </div>
                        }
                        {(Object.keys(props.notYetUsers).length !== 0) &&
                            <div className={styles.groupParticipationBox}>
                                <div className={styles.yetTag}>Not Yet</div>
                                <div className={styles.tagText}>
                                    {Object.keys(props.notYetUsers).length}
                                </div>
                            </div>
                        }
                </div>}
        </div>
    )
}