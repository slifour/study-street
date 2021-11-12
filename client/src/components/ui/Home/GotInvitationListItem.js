import React, {useContext, useState, useRef, useEffect} from "react";
import socket from "../../../socket";
import { LoginUserContext } from "../../../App";
import { HomeContext } from "./HomeMain";
import uniqueString from "unique-string";
import UserAvatarCircle from "./UserAvatarCircle";
import GotInvitationJoinButton from "./GotInvitationJoinButton";

export default function GotInvitationListItem({gotInvitation}) {
  const {loginUser} = useContext(LoginUserContext);
  const {reloadTime} = useContext(HomeContext);
  const usedRequestKeyRef = useRef(null);
  const innerReloadTimeRef = useRef(new Date(0));

  const [hostUser, setHostUser] = useState(null);

  const onResponse = ({requestKey, status, payload}) => {
      // console.log("Invite response got response: ", {requestKey, status, payload});
      if (requestKey === usedRequestKeyRef.current) {
          switch (status) {
              case "STATUS_OK":
                  setHostUser(payload);
                  break;
              case "STATUS_FAIL":
                  console.warn(payload.msg || "Failed to load a host profile (client msg)");
                  break;
          }
      }
  };

  const request = () => {
    const requestType = "REQUEST_MY_PROFILE";
    usedRequestKeyRef.current = uniqueString();
      
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: {
        userID: gotInvitation.hostUser
      }
    });

    innerReloadTimeRef.current = new Date();
  };

  useEffect(() => {
    if (reloadTime > innerReloadTimeRef.current) {
      request();
    }
  }, [reloadTime]);

  useEffect(() => {
    const responseType = "RESPONSE_MY_PROFILE";
    socket.on(responseType, onResponse);
    request();
    return () => {socket.off(responseType, onResponse);};
  }, []);

  if (!hostUser) {
    return (
      <div>
        Loading invites from {gotInvitation.hostUser} ...
      </div>
    );
  }

  return (
    <div>
      <UserAvatarCircle user={hostUser} size = {55}/>
      <div>
        {`${hostUser.userName} invited you to group\n"${gotInvitation.groupID}"`}
      </div>
      <GotInvitationJoinButton gotInvitation={gotInvitation}/>
    </div>
  );
}