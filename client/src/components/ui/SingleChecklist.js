import React, {useState} from 'react';
import styles from './checklist.module.css'

export default function SingleChecklist(props) {
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

    const handleToggle = () => {
        setDone(!isDone);
        //socket emit
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