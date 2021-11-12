import React, { useState } from 'react';
import styles from './checklist.module.css'

export default function ChecklistFloat() {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.floatContainer}>
            <div 
                className={styles.floatButtonMain}
                onClick = {()=>setOpen(!open)}
            >
                <div className={styles.iconsWhiteLarge}>add</div>
            </div>
            {open &&
                <div>
                    <div className={styles.floatBoxSubFirst}>
                        <div className={styles.floatBlur}></div>
                        <div className={styles.floatText}>New Goal</div>
                        <div className={styles.floatButtonSub}>
                            <div className={styles.iconsWhite}>flag</div>
                        </div>
                    </div>
                    <div className={styles.floatBoxSubSecond}>
                        <div className={styles.floatBlur}></div>
                        <div className={styles.floatText}>New Attendance</div>
                        <div className={styles.floatButtonSub}>
                            <div className={styles.iconsWhite}>calendar_today</div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
