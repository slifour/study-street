import React, {useContext, useEffect, useRef, useState} from "react";
import styles from "./home.module.scss";
import UserAvatarCircle from "./UserAvatarCircle";
import socket from "../../../socket";
import { LoginUserContext } from "../../../App";

export default function GroupMemberListItem({memberID}) {
  const {loginUser} = useContext(LoginUserContext);
  const usedRequestKeyRef = useRef(null);

  const [member, setMember] = useState({});

  const onResponse = ({requestKey, status, payload}) => {
      // console.log("Invite response got response: ", {requestKey, status, payload});
      if (requestKey === usedRequestKeyRef.current) {
          switch (status) {
              case "STATUS_OK":
                  setShowInput(true);
                  break;
              case "STATUS_FAIL":
                  console.warn(payload.msg || "Failed to load a group member profile (client msg)");
                  setShowInput(true);
                  break;
          }
      }
  };

  useEffect(() => {
    const responseType = "RESPONSE_MY_PROFILE";
    socket.on(responseType, onResponse);

    const requestType = "REQUEST_MY_PROFILE";
    usedRequestKeyRef.current = uniqueString();
      
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: {
        userID: memberID
      }
    });

    return () => {socket.off(responseType, onResponse);};
  }, [memberID]);

  const shortenName = memberID.substr(0, 2).toUpperCase();
  return (
    <div className={styles.groupListItem}>
      {
        member ? 
        <>
          <UserAvatarCircle user={member} size={50}/>
          <div className = {styles.groupListItemText}>{memberID}</div>
        </>
        : memberID
      }
    </div>
  );
}