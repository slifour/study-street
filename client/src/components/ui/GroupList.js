import React, { useContext, useState } from 'react';
import styles from "./ui.module.css";
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';
import { LoginUserContext } from '../../App';

const StyledModal = styled(Modal)`
    position: fixed;
    width: 340px;
    height: 310px;
    z-index: 1040;
    bottom: 10%;
    left: 20%;
    border-radius: 8px;
    outline: none;
    background-color: white;
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
    opacity: 0.2;
`;

const StyledGroupIcon = styled("div")`
    width: 40px;
    height: 40px;
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 50%;

    color: #FDFDFD;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;    

    background: ${props => props.color};
`;

export default function GroupList(props) {
    const {loginUser, setLoginUser} = useContext(LoginUserContext);
    const [showModal, setShowModal] = useState(true);

    const renderBackdrop = (props) => <Backdrop {...props} />;
    
    // Dummy data
    const groupList = {
        "a": {
            groupID: "a",
            groupName: "We love study",
            leader: "eunki",
            member: ["eunki", "haeseul"],
            color: "#FFE76A"
        },
        "b": {
            groupID: "b",
            groupName: "We love slifour",
            leader: "hyeon",
            member: ["eunki", "hyeon", "jeonghoon"],
        },
    }

    return(
        <div className = {styles.groupListContainer}>
            <div className = {styles.groupListHeader}>
                {/* <StyledIcon color={props.color}>{shortenName}</StyledIcon> */}
                <div className = {styles.chatName}>Groups</div>
            </div>
            <hr className={styles.styledHr}/>
            <div className={styles.groupListContent}>
                {
                    Object.values(groupList).map(group => (
                        <GroupListItem group={group} key={group.groupID}></GroupListItem>        
                    ))
                }
            </div>
            <hr className={styles.styledHr}/>
        </div>
    )
}

export function GroupListItem({group}) {
    const shortenName = group.groupName.substr(0, 2).toUpperCase();
    return (
        <div className={styles.groupListItem}>
            <StyledGroupIcon color={group.color || '#79ACBC'}>{shortenName}</StyledGroupIcon>
            <div className = {styles.groupListItemText}>{group.groupName}</div>
        </div>
    )
}

export function GroupListButton(props) {
    const [show, setShow] = useState(false);
    const renderBackdrop = props => <Backdrop {...props} />;
    return (
        <>
        <div className={`${styles.groupListButton} ${styles.hvrGrow}`} onClick={() => {setShow(true)}}>
            Groups
        </div> 
        <StyledModal
            show = {show}
            onHide = {() => setShow(false)}
            renderBackdrop = {renderBackdrop}>
            {show ? <GroupList></GroupList> : null}
        </StyledModal>
        </>
    )
}