import React, {useState, useCallback} from "react";
import UserAvatarCircle from "./UserAvatarCircle";
import GotInvitationJoinButton from "./GotInvitationJoinButton";
import useRequest from "../../request/useRequest";
import useLiveReload from "../../request/useLiveReload";

export default function GotInvitationListItem({gotInvitation}) {
  const [hostUser, setHostUser] = useState(null);

  const onResponseOK = useCallback(({payload}) => {
    setHostUser(payload);
  }, [setHostUser]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to load a host profile (client msg)");
  }, []); 

  const makePayload = useCallback(() => (
    {userID: gotInvitation.hostUser}
  ), [gotInvitation.hostUser]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_MY_PROFILE",
    responseType: "RESPONSE_MY_PROFILE",
    makePayload,
    onRequest: null,
    onResponseOK,
    onResponseFail
  });

  useLiveReload({request, innerReloadTimeRef});
  
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