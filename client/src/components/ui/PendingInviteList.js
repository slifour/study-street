import React, { useRef, useEffect, useState, useContext } from "react"
import socket from "../../socket";
import uniqueString from "unique-string";
import { LoginUserContext } from "../../App";
import styles from "./ui.module.css";

export default function PendingInviteList({group, requestTime}) {
  const [invitationList, setInvitationList] = useState([]);
  const {loginUser} = useContext(LoginUserContext);
  const usedRequestKeyRef = useRef(null);

  const onResponse = ({requestKey, status, payload}) => {
    if (requestKey === usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK":
          setInvitationList(payload);
          break;
        case "STATUS_FAIL":
          console.warn("Failed to load pending invite list");
          break;
      }
    }
  };

  useEffect(() => {
    const responseType = "RESPONSE_PENDING_INVITE_LIST";
    socket.on(responseType, onResponse);
    return () => {socket.off(responseType, onResponse);};
  }, []);

  useEffect(() => {
    if (loginUser) {
      const requestType = "REQUEST_PENDING_INVITE_LIST";
      usedRequestKeyRef.current = uniqueString();
        
      socket.emit(requestType, {
          requestUser: loginUser.userID,
          requestKey: usedRequestKeyRef.current,
          requestType,
          payload: { groupID: group.groupID }
      });
    }
  }, [loginUser, group.groupID, requestTime]);  

  return (
  <>
    { 
      invitationList ?
      invitationList.map( ({friendID, inviteTime}) => {
        return (
          <div className={styles.groupListItem} key={friendID}>
            <div className = {styles.groupListItemText}>📬 Invite sent: {friendID} </div>
          </div>)
        ;
      })
      : null 
    }
  </>);
}
