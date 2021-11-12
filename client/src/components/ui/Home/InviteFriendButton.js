import { useRef, useEffect, useState, useContext } from "react"
import socket from "../../../socket";
import uniqueString from "unique-string";
import { LoginUserContext } from "../../../App";
import styles from "./home.module.scss";

export default function InviteFriendButton({group, onInvite}) {
  const [showInput, setShowInput] = useState(false);
  const [friend, setFriend] = useState("");
  const {loginUser} = useContext(LoginUserContext);

  const usedRequestKeyRef = useRef(null);

  const onResponse = ({requestKey, status, payload}) => {
      console.log("Invite response got response: ", {requestKey, status, payload});
      if (requestKey === usedRequestKeyRef.current) {
          switch (status) {
              case "STATUS_OK":
                  setShowInput(true);
                  onInvite();
                  break;
              case "STATUS_FAIL":
                  alert(payload.msg || "Failed to invite a friend (client msg)");
                  setShowInput(true);
                  break;
          }
      }
  };

  useEffect(() => {
      const responseType = "RESPONSE_INVITE_FRIEND";
      socket.on(responseType, onResponse);
      return () => {socket.off(responseType, onResponse);};
  }, []);

  const onInviteClick = () => {
      const requestType = "REQUEST_INVITE_FRIEND";
      usedRequestKeyRef.current = uniqueString();
        
      socket.emit(requestType, {
          requestUser: loginUser.userID,
          requestKey: usedRequestKeyRef.current,
          requestType,
          payload: {
            groupID: group.groupID,
            friendID: friend
          }
      });
  };

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