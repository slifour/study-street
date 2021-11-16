import React, { useContext, useState, useCallback } from 'react';
import styles from "./home.module.scss";
import styled from 'styled-components';
import InviteFriendButton from './InviteFriendButton';
import PendingInviteList from './PendingInviteList';
import GroupMemberListItem from './GroupMemberListItem';
import { ReloadContext } from '../../request/ReloadContext';


export default function GroupMemberList({group}) {
    const [pendingInviteListRequestTime, setPendingInviteListRequestTime] = useState(new Date());

    const {setReloadTime} = useContext(ReloadContext);

    const dummyGroup = { // Dummy data
        groupID: "a",
        level: 3,
        experiencePoint: 0.9,
        groupName: "We love study",
        leader: "eunki",
        member: ["eunki", "haeseul"],
        color: "#FFE76A"
    };

    const onInvite = useCallback( () => {
        setReloadTime(new Date());
    }, [setReloadTime]);

    return(
        <div>
            <h2>Members</h2>
            <div className={styles.groupListContent}>
                {
                    group.member.map(memberID => (
                        <GroupMemberListItem memberID={memberID} key={memberID}></GroupMemberListItem>        
                    ))
                }
                <PendingInviteList group={group} requestTime={pendingInviteListRequestTime}/>
                <InviteFriendButton group={group} onInvite={onInvite}/>
            </div>
        </div>
    );
}

// export function GroupMemberListItem({memberID}) {
//     const shortenName = memberID.substr(0, 2).toUpperCase();
//     return (
//         <div className={styles.groupListItem}>
//             {/* <GroupIcon group={group}></GroupIcon> */}
//             <div className = {styles.groupListItemText}>{memberID}</div>
//         </div>
//     )
// }