import React, {useState, useRef, useContext, useCallback } from "react";
import GroupColorSelect from "./GroupColorSelect";
import styles from "./home.module.scss";
import { HomeContext } from "./HomeMain";
import useRequest from "./useRequest";

export default function HomeInfoCreateGroup() {
  const {setReloadTime} = useContext(HomeContext);
  const [groupName, setGroupName] = useState("");

  const onResponseOK = useCallback(() => {
    setReloadTime(new Date());
  }, [setReloadTime]);
  const onResponseFail = useCallback(({payload}) => {
    alert(payload.msg || "Failed to create a group (client msg)");
  }, []);
  const makePayload = useCallback(() => ({groupName}), [groupName]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_CREATE_GROUP",
    responseType: "RESPONSE_CREATE_GROUP",
    onResponseOK,
    onResponseFail,
    makePayload
  });

  const onClickCreateGroup = request;

  const onInputChange = e => {
    setGroupName(e.target.value);
  };

  return (
    <div>
      <h1>Create a group</h1>
      <div> 
        <input value={groupName} onChange={onInputChange}/>
      </div>
      <GroupColorSelect/>
      <div>
        <button onClick={onClickCreateGroup}> Create a group </button>
      </div>
    </div>
  );
}