import React, { useContext, useState, useEffect } from "react"
import HomeUserAvatar from "./HomeUserAvatar";
import GroupIconList from "./GroupIconList";
import CreateGroupButton from "./CreateGroupButton";
import InvitationButton from "./InvitationButton";
import SettingButton from "./SettingButton";
import HomeInfoUser from "./HomeInfoUser";
import HomeInfoGroup from "./HomeInfoGroup";
import styles from "./home.module.scss";
import HomeInfoCreateGroup from "./HomeInfoCreateGroup";
import HomeInfoGotInvitation from "./HomeInfoGotInvitation";
import { LoginUserContext } from "../../../App";
import { GameContext } from "../../../App";
import HomeInfoCloseButton from "./HomeInfoCloseButton";
import { ReloadContext } from "../../request/ReloadContext";

export default function HomeMain(props) {
  const SHOW_USER = "SHOW_USER";
  const SHOW_GROUP = "SHOW_GROUP";
  const SHOW_CREATE_GROUP = "SHOW_CREATE_GROUP";
  const SHOW_GOT_INVITATION = "SHOW_GOT_INVITATION";
  const SHOW_NONE = "SHOW_NONE";

  const [currentShow, setCurrentShow] = useState(SHOW_USER);
  const [currentGroup, setCurrentGroup] = useState(null); // group
  const [reloadTime, setReloadTime] = useState(new Date());
  const {loginUser} = useContext(LoginUserContext);
  const {disableInput} = useContext(GameContext);

  // useEffect(() => {
  //   disableInput();
  // }, [])

  const onSetGroup = group => {
    setCurrentGroup(group);
    setCurrentShow(SHOW_GROUP);
  }

  const onClickUser = () => {
    setCurrentShow(SHOW_USER);
  }

  const onClickCreateGroup = () => {
    setCurrentShow(SHOW_CREATE_GROUP);
  }

  const onClickInvitation = () => {
    setCurrentShow(SHOW_GOT_INVITATION);
  }

  const onClickHomeInfoClose = () => {
    setCurrentShow(SHOW_NONE);
  }

  if (!loginUser) {
    return (
      <div>
        <div className={styles.sidebar}>
          <div className={styles.sidebarItem}>
            Not logged in.
          </div>
        </div>
        {/* <div className={styles.infoArea}/> */}
      </div>
    )
  }

  return (
    <ReloadContext.Provider value = {{reloadTime, setReloadTime}}>
      <div>
        <div className={styles.sidebar}>        
          <div onClick={onClickUser}><HomeUserAvatar/></div>
          <GroupIconList onSetGroup={onSetGroup}/>
          <div onClick={onClickCreateGroup}><CreateGroupButton/></div>
          <div onClick={onClickInvitation}><InvitationButton/></div>
          <SettingButton/>
        </div>
        {currentShow !== SHOW_NONE ? 
          <div className={styles.infoArea}>
            { currentShow === SHOW_USER ? <HomeInfoUser/> : null}
            { currentShow === SHOW_GROUP ? <HomeInfoGroup group={currentGroup}/> : null}
            { currentShow === SHOW_CREATE_GROUP ? <HomeInfoCreateGroup/> : null}
            { currentShow === SHOW_GOT_INVITATION ? <HomeInfoGotInvitation/> : null}
            <HomeInfoCloseButton onClick={onClickHomeInfoClose}/>
          </div>
          : null}
      </div>
    </ReloadContext.Provider>
  );
}