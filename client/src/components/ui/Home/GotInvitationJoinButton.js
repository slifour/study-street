import React, {useContext, useState, useRef, useEffect} from "react";
import socket from "../../../socket";
import { LoginUserContext } from "../../../App";
import { HomeContext } from "./HomeMain";
import uniqueString from "unique-string";
import styles from "./home.module.scss";

export default function GotInvitationJoinButton({gotInvitation}) {

  const {loginUser} = useContext(LoginUserContext);
  const {setReloadTime} = useContext(HomeContext);

  const usedRequestKeyRef = useRef(null);

  const onResponse = ({requestKey, status, payload}) => {
    if (requestKey === usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK":
          setReloadTime(new Date());
          break;
        case "STATUS_FAIL":
          console.warn(payload.msg || "Failed to accept invitation (client msg)");
          break;
      }
    }
  };

  const request = () => {
    if (!loginUser) return;

    const requestType = "REQUEST_JOIN_GROUP";
    usedRequestKeyRef.current = uniqueString();
    
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: {
        groupID: gotInvitation.groupID
      }
    });
  }

  useEffect(() => {
    const responseType = "RESPONSE_JOIN_GROUP";
    socket.on(responseType, onResponse);
    return () => {socket.off(responseType, onResponse);};
  }, []);

  const onClick = () => {
    request();
  };

  return (
    <button onClick={onClick}>
      Join
    </button>
  );
}