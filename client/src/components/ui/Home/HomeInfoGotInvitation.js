import React, {useContext, useState, useRef, useEffect} from "react";
import socket from "../../../socket";
import { LoginUserContext } from "../../../App";
import { HomeContext } from "./HomeMain";
import uniqueString from "unique-string";
import GotInvitationListItem from "./GotInvitationListItem";
import styles from "./home.module.scss";

export default function HomeInfoGotInvitation() {
  const {loginUser} = useContext(LoginUserContext);
  const {reloadTime} = useContext(HomeContext);
  const [gotInvitationList, setGotInvitationList] = useState([]);

  const usedRequestKeyRef = useRef(null);
  const innerReloadTimeRef = useRef(new Date(0)); // very old date ( 1970/01/01 )

  const onResponse = ({requestKey, status, payload}) => {
    if (requestKey === usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK":
          setGotInvitationList(payload);
          break;
        case "STATUS_FAIL":
          console.warn(payload.msg || "Failed to obtain got invitation lists (client msg)");
          break;
      }
    }
  };

  const request = () => {
    if (!loginUser) return;

    const requestType = "REQUEST_PENDING_INVITE_LIST";
    usedRequestKeyRef.current = uniqueString();
    
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: {
        userID: loginUser.userID
      }
    });

    innerReloadTimeRef.current = new Date();
  }

  useEffect(() => {
    const responseType = "RESPONSE_PENDING_INVITE_LIST";
    socket.on(responseType, onResponse);
    return () => {socket.off(responseType, onResponse);};
  }, []);

  useEffect(() => {
    request();
  }, [loginUser]);

  /* Update on reload home */
  useEffect(() => {
    if (reloadTime > innerReloadTimeRef.current) {
      request();
    }
  }, [reloadTime])

  return (
    <div>
      <h1>Invites</h1>
      <div>
        {gotInvitationList.map( gotInvitation => (
          <GotInvitationListItem 
            key={`${gotInvitation.groupID} ${gotInvitation.friendID}`}
            gotInvitation={gotInvitation}/>
        ))}
      </div>
    </div>
  );
}