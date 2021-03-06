import React, {useState, useRef, useContext, useCallback } from "react";
import GroupColorSelect from "./GroupColorSelect";
import styles from "./home.module.css";
import { ReloadContext } from "../../request/ReloadContext";
import useRequest from "../../request/useRequest";

export default function HomeInfoCreateGroup() {
  const {setReloadTime} = useContext(ReloadContext);
  const [groupName, setGroupName] = useState("");
  const [colors, setColors] = useState([]);

  const onResponseOK = useCallback(() => {
    setReloadTime(new Date());
  }, [setReloadTime]);
  const onResponseFail = useCallback(({payload}) => {
    alert(payload.msg || "Failed to create a group (client msg)");
  }, []);
  const makePayload = useCallback(() => ({groupName, colors}), [groupName, colors]);

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