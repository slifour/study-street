import React, {useState, useRef, useContext, useEffect} from "react";
import GroupColorSelect from "./GroupColorSelect";
import styles from "./home.module.scss";
import { LoginUserContext } from "../../../App";
import { HomeContext } from "./HomeMain";
import socket from "../../../socket";
import uniqueString from "unique-string";

export default function HomeInfoCreateGroup() {
  const {loginUser} = useContext(LoginUserContext);
  const {setReloadTime} = useContext(HomeContext);
  const [groupName, setGroupName] = useState("");

  const usedRequestKeyRef = useRef(null);

  const onResponse = ({requestKey, status, payload}) => {
    if (requestKey === usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK":
          setReloadTime(new Date());
          break;
        case "STATUS_FAIL":
          alert(payload.msg || "Failed to create a group (client msg)");
          break;
      }
    }
  };

  useEffect(() => {
      const responseType = "RESPONSE_CREATE_GROUP";
      socket.on(responseType, onResponse);
      return () => {socket.off(responseType, onResponse);};
  }, []);

  const onClickCreateGroup = () => {
    const requestType = "REQUEST_CREATE_GROUP";
    usedRequestKeyRef.current = uniqueString();
      
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: {
        groupName
      }
    });
  };

  const onInputChange = e => {
    setGroupName(e.target.value);
  }

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