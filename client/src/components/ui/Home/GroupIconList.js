import React, {useCallback, useContext, useEffect, useState } from 'react';
import { LoginUserContext } from '../../../App';
import { HomeContext } from './HomeMain';
import styles from "./home.module.scss";
import GroupAvatarCircle from './GroupAvatarCircle';
import useRequest from './useRequest';
import useLiveReloadHome from './useLiveReloadHome';

export default function GroupIconList({onSetGroup}) {

  const [groupList, setGroupList] = useState([]);

  const onResponseOK = useCallback(({payload}) => {
    console.log("Group Icon List (client) got: ", payload);
    setGroupList(payload);
  }, [setGroupList]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to obtain groups (client msg)");
  }, []);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_MY_GROUP_LIST",
    responseType: "RESPONSE_MY_GROUP_LIST",
    onResponseOK,
    onResponseFail
  });

  /* Update on reload home */
  useLiveReloadHome({request, innerReloadTimeRef});

  const onGroupIconClick = group => {
    onSetGroup && onSetGroup(group);
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