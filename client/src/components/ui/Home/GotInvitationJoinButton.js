import React, {useCallback, useContext} from "react";
import { HomeContext } from "./HomeMain";
import styles from "./home.module.scss";
import useRequest from "./useRequest";

export default function GotInvitationJoinButton({gotInvitation}) {
  const {setReloadTime} = useContext(HomeContext);

  const onResponseOK = useCallback(({payload}) => {
    setReloadTime(new Date());
  }, [setReloadTime]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to accept invitation (client msg)");
  }, []);

  const makePayload = useCallback(() => ({
    groupID: gotInvitation.groupID
  }), [gotInvitation.groupID]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_JOIN_GROUP",
    responseType: "RESPONSE_JOIN_GROUP",
    makePayload,
    onResponseOK,
    onResponseFail
  });

  return (
    <button onClick={request}>
      Join
    </button>
  );
}