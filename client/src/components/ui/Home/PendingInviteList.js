import React, { useCallback, useState } from "react"
import styles from "./home.module.css";
import useLiveReload from "../../request/useLiveReload";
import useRequest from "../../request/useRequest";

export default function PendingInviteList({group}) {
  const [invitationList, setInvitationList] = useState([]);

  const onResponseOK = useCallback(({payload}) => {
    setInvitationList(payload);
  }, [setInvitationList]);
  const onResponseFail = useCallback(({payload}) => {
    console.warn("Failed to load pending invite list");
  }, []);
  const makePayload = useCallback(() => ({ groupID: group.groupID }), [group.groupID]);

  const [request, innerReloadTimeRef] = useRequest({
      requestType: "REQUEST_PENDING_INVITE_LIST",
      responseType: "RESPONSE_PENDING_INVITE_LIST",
      onResponseOK,
      onResponseFail,
      makePayload
  });  

  useLiveReload({request, innerReloadTimeRef});

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
