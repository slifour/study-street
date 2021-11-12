import React, {useContext, useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { LoginUserContext } from '../../../App';
import { HomeContext } from './HomeMain';
import socket from '../../../socket';
import uniqueString from 'unique-string';
import styles from "./home.module.scss";
import GroupAvatarCircle from './GroupAvatarCircle';

export default function GroupIconList({onSetGroup}) {

    const {loginUser} = useContext(LoginUserContext);
    const {reloadTime} = useContext(HomeContext);
    const [groupList, setGroupList] = useState([]);

    const usedRequestKeyRef = useRef(null);
    const innerReloadTimeRef = useRef(new Date(0)); // very old date ( 1970/01/01 )

    const onResponse = ({requestKey, status, payload}) => {
      if (requestKey === usedRequestKeyRef.current) {
        switch (status) {
          case "STATUS_OK":
            console.log("Group Icon List (client) got: ", payload);
            setGroupList(payload);
            break;
          case "STATUS_FAIL":
            console.warn(payload.msg || "Failed to obtain groups (client msg)");
            break;
        }
      }
    };

    const request = () => {
      if (!loginUser) return;

      const requestType = "REQUEST_MY_GROUP_LIST";
      usedRequestKeyRef.current = uniqueString();
      
      socket.emit(requestType, {
        requestUser: loginUser.userID,
        requestKey: usedRequestKeyRef.current,
        requestType,
        payload: {}
      });

      innerReloadTimeRef.current = new Date();
    }

    useEffect(() => {
      const responseType = "RESPONSE_MY_GROUP_LIST";
      socket.on(responseType, onResponse);
      return () => {socket.off(responseType, onResponse);};
    }, []);

    useEffect(() => {
      request();
    }, [loginUser]);

    /* Update on reload home */
    useEffect(() => {
      if (reloadTime > innerReloadTimeRef.current) {
        request();
      }
    }, [reloadTime])

    const onGroupIconClick = group => {
      if (onSetGroup.apply) {
        onSetGroup(group);
      }
    }

    return (
        <div>
          {
            groupList.map(group => (
              <div className={styles.sidebarItem} key={group.groupID} onClick={onGroupIconClick.bind(this, group)}>
                <GroupAvatarCircle group={group}/>
              </div>
            ))
          }
        </div>
    );
}