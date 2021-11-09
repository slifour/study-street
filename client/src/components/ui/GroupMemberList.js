import React, { useContext, useEffect, useState } from 'react';
import styles from "./ui.module.css";
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';
import { LoginUserContext } from '../../App';
import socket from '../../socket';
import GroupIcon from './GroupIcon';
import InviteFriend from './InviteFriend';
import PendingInviteList from './PendingInviteList';

const StyledModal = styled(Modal)`
    position: fixed;
    width: 340px;
    height: 310px;
    z-index: 1040;
    bottom: 10%;
    left: 50%;
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

export default function GroupMemberList(props) {
    const {loginUser} = useContext(LoginUserContext);
    // const [groupList, setGroupList] = useState({});
    const {show, setShow, group} = props;
    const [pendingInviteListRequestTime, setPendingInviteListRequestTime] = useState(new Date());

    const dummyGroup = { // Dummy data
        groupID: "a",
        groupName: "We love study",
        leader: "eunki",
        member: ["eunki", "haeseul"],
        color: "#FFE76A"
    };

    const renderBackdrop = (props) => <Backdrop {...props} />;

    return(
        <StyledModal
            show = {show}
            onHide = {() => setShow(false)}
            renderBackdrop = {renderBackdrop}>
            <div className = {styles.groupListContainer}>
                <div className = {styles.groupListHeader}>
                    <GroupIcon group={group}></GroupIcon>
                    <div className = {styles.chatName}>{group.groupName}</div>
                </div>
                <hr className={styles.styledHr}/>
                <div className={styles.groupListContent}>
                    {
                        group.member.map(memberID => (
                            <GroupMemberListItem memberID={memberID} key={memberID}></GroupMemberListItem>        
                        ))
                    }
                    <PendingInviteList group={group} requestTime={pendingInviteListRequestTime}></PendingInviteList>
                    <InviteFriend group={group} onInvite={() => {setPendingInviteListRequestTime(new Date())}}></InviteFriend>
                </div>
                <hr className={styles.styledHr}/>
            </div>
        </StyledModal>
    )
}

export function GroupMemberListItem({memberID}) {
    const shortenName = memberID.substr(0, 2).toUpperCase();
    return (
        <div className={styles.groupListItem}>
            {/* <GroupIcon group={group}></GroupIcon> */}
            <div className = {styles.groupListItemText}>{memberID}</div>
        </div>
    )
}