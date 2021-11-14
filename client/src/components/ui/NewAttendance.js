import React, { useState } from "react";
import styles from './checklist.module.css'

export default function NewAttendance(props) {
    const [date, setDate] = useState('');
    const changeDate = (e) => {
        setDate(e.target.value);
    }

    const onCreate = () => {
        props.callClose();
        //**socket** add new attendance 
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
                <div className={styles.cancelButton}>Cancel</div>
                <div className={styles.createButton} onClick={()=>onCreate()}>Create</div>
            </div>
        </div>
    )
}