import React, { useState } from 'react';
import styles from './checklist.module.css'
import styled from "styled-components";
import Modal from 'react-overlays/Modal';
import NewAttendance from './NewAttendance';
import NewGoal from './NewGoal';

const StyledModal = styled(Modal)`
    position: fixed;
    width: 500px;
    height: 275px;
    z-index: 1040;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 11px;
    outline: none;
    background-color: #FBFBFB;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
`;

const Backdrop = styled("div")`
    position: fixed;
    z-index: 1040;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    opacity: 0.1;
`;

export default function ChecklistFloat(props) {
    const [open, setOpen] = useState(false);
    const [goal, setGoal] = useState(false);
    const [attendance, setAttendance] = useState(false);
    const renderBackdrop = (props) => <Backdrop {...props} />;

    const callUpdate = () => {
        props.callUpdate();
    }

    const setClose = () => {
        setOpen(false);
        setGoal(false);
        setAttendance(false);
    }

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
                        <div className={styles.floatButtonSub} onClick={()=>setGoal(true)}>
                            <div className={styles.iconsWhite}>flag</div>
                        </div>
                    </div>
                    <div className={styles.floatBoxSubSecond}>
                        <div className={styles.floatBlur}></div>
                        <div className={styles.floatText}>New Attendance</div>
                        <div className={styles.floatButtonSub} onClick={()=>setAttendance(true)}>
                            <div className={styles.iconsWhite}>calendar_today</div>
                        </div>
                    </div>
                </div>
            }
            <StyledModal
                    show = {goal}
                    onHide = {() => setGoal(false)}
                    renderBackdrop = {renderBackdrop}
            ><NewGoal callClose={setClose} callUpdate={callUpdate}></NewGoal>
            </StyledModal>
            <StyledModal
                    show = {attendance}
                    onHide = {() => setAttendance(false)}
                    renderBackdrop = {renderBackdrop}
            ><NewAttendance callClose={setClose} callUpdate={callUpdate}></NewAttendance>
            </StyledModal>
        </div>
    )
}
