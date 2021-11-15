import React, { useState } from "react";
import styles from './checklist.module.css'

export default function NewGoal(props) {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const changeHour = (e) => {
        setHour(e.target.value);
    }
    const changeMinute = (e) => {
        setMinute(e.target.value);
    }

    const onCreate = () => {
        props.callClose();
        //**socket** add new attendance 
    }

    return(
        <div>
            <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>New Goal</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.modalContent}>
                <div className={styles.modalContentText}>Date</div>
                <form>
                    <input
                        type="datetime-local"
                        className={styles.picker}
                        // onChange={}
                    ></input>
                </form>
            </div>
            <div className={styles.modalFooter}>
                <div className={styles.cancelButton}>Cancel</div>
                <div className={styles.createButton} onClick={()=>onCreate()}>Create</div>
            </div>
        </div>
    )
}