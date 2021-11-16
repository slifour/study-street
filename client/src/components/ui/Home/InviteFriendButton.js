import React, { useCallback, useState } from "react"
import styles from "./home.module.scss";
import useRequest from "../../request/useRequest";

export default function InviteFriendButton({group, onInvite}) {
  const [showInput, setShowInput] = useState(false);
  const [friend, setFriend] = useState("");

  const onResponseOK = useCallback(({payload}) => {
    setShowInput(true);
    onInvite();  
  }, [setShowInput, onInvite]);

  const onResponseFail = useCallback(({payload}) => {
    alert(payload.msg || "Failed to invite a friend (client msg)");
    setShowInput(true);
  }, [setShowInput]);

  const makePayload = useCallback(() => ({
    groupID: group.groupID,
    friendID: friend
  }), [group.groupID, friend]);

  const [request, innerReloadTimeRef] = useRequest({
      requestType: "REQUEST_INVITE_FRIEND",
      responseType: "RESPONSE_INVITE_FRIEND",
      onResponseOK,
      onResponseFail,
      makePayload
  });  

  const onInviteClick = request;

  const onInputChange = e => {
      setFriend(e.target.value);
  }

  return (
      <div className={styles.groupListItem} onClick={() => {setShowInput(true)}}>
          {!showInput ? 
              <div className = {styles.groupListItemText}>💌 Invite a friend</div> :
              <div> 
                <input type="text" name="inviteFriend" value={friend} onChange={onInputChange}></input>
                <button onClick={onInviteClick}>Invite</button>
              </div>
          }
      </div>
  )
}