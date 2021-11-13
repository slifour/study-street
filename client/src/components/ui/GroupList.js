import React, { useContext, useEffect, useState, useRef } from 'react';
import styles from "./ui.module.css";
import { LoginUserContext } from '../../App';
import socket from '../../socket';
import GroupIcon from './GroupIcon';
import OverlayButton from './OverlayButton';
import GroupMemberList from './GroupMemberList';
import uniqueString from 'unique-string';

export default function GroupList(props) {
    const {loginUser} = useContext(LoginUserContext);
    const [groupList, setGroupList] = useState({});

    const usedRequestKeyRef = useRef(null);

    const onResponse = ({requestKey, status, payload}) => {
        if (requestKey === usedRequestKeyRef.current) {
            switch (status) {
                case "STATUS_OK":
                    setGroupList(payload);
                    break;
                case "STATUS_FAIL":
                    alert(payload.msg || "Failed to obtain groups (client msg)");
                    break;
            }
        }
    };

    useEffect(() => {
        const responseType = "RESPONSE_MY_GROUP_LIST";
        socket.on(responseType, onResponse);
        return () => {socket.off(responseType, onResponse);};
    }, []);

    useEffect(() => {
        if (!loginUser) return;

        const requestType = "REQUEST_MY_GROUP_LIST";
        usedRequestKeyRef.current = uniqueString();
        
        socket.emit(requestType, {
            requestUser: loginUser.userID,
            requestKey: usedRequestKeyRef.current,
            requestType,
            payload: {}
          });
    }, [loginUser])
    
    // Dummy data
    // const groupList = {
    //     "a": {
    //         groupID: "a",
    //         groupName: "We love study",
    //         leader: "eunki",
    //         member: ["eunki", "haeseul"],
    //         color: "#FFE76A"
    //     },
    //     "b": {
    //         groupID: "b",
    //         groupName: "We love slifour",
    //         leader: "hyeon",
    //         member: ["eunki", "hyeon", "jeonghoon"],
    //     },
    // }

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

    const [showMemberList, setShowMemberList] = useState(false);

    const onClick = () => {
        setShowMemberList(true);
    }

    return (
        <>
        <div className={styles.groupListItem} onClick={onClick}>
            <GroupIcon group={group}></GroupIcon>
            <div className = {styles.groupListItemText}>{group.groupName}</div>
        </div>
        <GroupMemberList show={showMemberList} setShow={setShowMemberList} group={group}></GroupMemberList>
        </>
    )
}

export function GroupListButton(props) {
    return (
        <OverlayButton text="Your Groups" buttonStyle = {{left: "20%", bottom: "10%"}} id = {"GroupList"}>
            <GroupList></GroupList>
        </OverlayButton>
    );
}