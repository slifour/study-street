import React, {useCallback, useState} from "react";
import styles from "./home.module.scss";
import UserAvatarCircle from "./UserAvatarCircle";
import useRequest from "./useRequest";
import useLiveReloadHome from "./useLiveReloadHome";

export default function GroupMemberListItem({memberID}) {
  const [member, setMember] = useState(null);

  const onResponseOK = useCallback(({payload}) => {
    setMember(payload);
  }, [setMember]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to load a group member profile (client msg)");
  }, []);

  const makePayload = useCallback(() => ({
    userID: memberID
  }), [memberID]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_MY_PROFILE",
    responseType: "RESPONSE_MY_PROFILE",
    makePayload,
    onResponseOK,
    onResponseFail
  });

  useLiveReloadHome({request, innerReloadTimeRef});

  return (
    <div className={styles.groupListItem}>
      {
        member ? 
        <>
          <UserAvatarCircle user={member} size={50}/>
          <div className = {styles.groupListItemText}>{memberID}</div>
        </>
        : <> {memberID} (loading..) </>
      }
    </div>
  );
}