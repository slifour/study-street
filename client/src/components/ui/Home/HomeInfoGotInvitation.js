import React, { useCallback, useContext, useState } from "react";
import { LoginUserContext } from "../../../App";
import GotInvitationListItem from "./GotInvitationListItem";
import styles from "./home.module.scss";
import useLiveReloadHome from "./useLiveReloadHome";
import useRequest from "./useRequest";

export default function HomeInfoGotInvitation() {
  const {loginUser} = useContext(LoginUserContext);
  const [gotInvitationList, setGotInvitationList] = useState([]);

  const onResponseOK = useCallback(({payload}) => {
    setGotInvitationList(payload);
  }, [setGotInvitationList]);
  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to obtain got invitation lists (client msg)");
  }, []);
  const makePayload = useCallback(() => ({      
    userID: loginUser.userID
  }), [loginUser.userID]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_PENDING_INVITE_LIST",
    responseType: "RESPONSE_PENDING_INVITE_LIST",
    onResponseOK,
    onResponseFail,
    makePayload
  });

  useLiveReloadHome({request, innerReloadTimeRef});

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