import React, { useCallback, useState } from 'react';
import styles from "./home.module.css";
import GroupAvatarCircle from '../GroupAvatarCircle';
import useRequest from '../../request/useRequest';
import useLiveReload from '../../request/useLiveReload';

export default function GroupIconList({onSetGroup}) {

  const [groupList, setGroupList] = useState([]);

  const onResponseOK = useCallback(({payload}) => {
    console.log("Group Icon List (client) got: ", payload);
    setGroupList(payload);
    if (payload.length > 0){
      onGroupIconClick(payload[0]);
    }
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
  useLiveReload({request, innerReloadTimeRef});

  const onGroupIconClick = group => {
    onSetGroup && onSetGroup(group);
  }

  return (
    <div>
      {
        groupList.map(group => (
          <div className={styles.sidebarItem} key={group.groupID}>
            <GroupAvatarCircle group={group} onClick={onGroupIconClick.bind(this, group)}/>
          </div>
        ))
      }
    </div>
  );
}