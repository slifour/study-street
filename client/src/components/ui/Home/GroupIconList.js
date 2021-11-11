import React, {useContext, useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { LoginUserContext } from '../../../App';
import socket from '../../../socket';
import uniqueString from 'unique-string';
import styles from "./home.module.css";

const StyledAvatar = styled.div`
    width: 70px;
    height: 70px;
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 50%;

    color: #FDFDFD;
    line-height: 70px;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    cursor: pointer;

    background: ${props => props.color};
`;

export default function GroupIconList(props) {

    const {loginUser} = useContext(LoginUserContext);
    const [groupList, setGroupList] = useState([]);

    const usedRequestKeyRef = useRef(null);

    const onResponse = ({requestKey, status, payload}) => {
        if (requestKey === usedRequestKeyRef.current) {
            switch (status) {
                case "STATUS_OK":
                    setGroupList(payload);
                    break;
                case "STATUS_FAIL":
                    console.warn(payload.msg || "Failed to obtain groups (client msg)");
                    break;
            }
        }
    };

    useEffect(() => {
        const responseType = "RESPONSE_MY_GROUP_LIST";
        socket.on(responseType, onResponse);
        return () => {socket.off(responseType, onResponse);};
    }, []);

    useEffect(() => {
        if (!loginUser) return;

        const requestType = "REQUEST_MY_GROUP_LIST";
        usedRequestKeyRef.current = uniqueString();
        
        socket.emit(requestType, {
            requestUser: loginUser.userID,
            requestKey: usedRequestKeyRef.current,
            requestType,
            payload: {}
          });
    }, [loginUser])

    return (
        <div>
          {
            groupList.map(group => {
              <GroupIcon group={group} setGroupList ></GroupIcon>
            })
          }
        </div>
    )
}

function GroupIcon({group, onSetGroup}) {
  return (
    <div className={styles.sidebarItem}>
      <StyledAvatar color = {group.color || "#555555"} onClick={onSetGroup}>
        {group.groupID.substr(0, 2).toUpperCase()}
      </StyledAvatar>
    </div>
  );
}