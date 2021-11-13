import React, { useContext, useState } from "react"
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

export const HomeContext = React.createContext(null);

export default function HomeMain(props) {
  const SHOW_USER = "SHOW_USER";
  const SHOW_GROUP = "SHOW_GROUP";
  const SHOW_CREATE_GROUP = "SHOW_CREATE_GROUP";
  const SHOW_GOT_INVITATION = "SHOW_GOT_INVITATION";

  const [currentShow, setCurrentShow] = useState(SHOW_USER);
  const [currentGroup, setCurrentGroup] = useState(null); // group
  const [reloadTime, setReloadTime] = useState(new Date());
  const {loginUser} = useContext(LoginUserContext);

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

  if (!loginUser) {
    return (
      <div>
        <div className={styles.sidebar}>
          <div className={styles.sidebarItem}>
            Not logged in.
          </div>
        </div>
        <div className={styles.infoArea}/>
      </div>
    )
  }

  return (
    <HomeContext.Provider value = {{reloadTime, setReloadTime}}>
      <div>
        <div className={styles.sidebar}>        
          <div onClick={onClickUser}><HomeUserAvatar/></div>
          <GroupIconList onSetGroup={onSetGroup}/>
          <div onClick={onClickCreateGroup}><CreateGroupButton/></div>
          <div onClick={onClickInvitation}><InvitationButton/></div>
          <SettingButton/>
        </div>
        <div className={styles.infoArea}>
          { currentShow === SHOW_USER ? <HomeInfoUser/> : null}
          { currentShow === SHOW_GROUP ? <HomeInfoGroup group={currentGroup}/> : null}
          { currentShow === SHOW_CREATE_GROUP ? <HomeInfoCreateGroup/> : null}
          { currentShow === SHOW_GOT_INVITATION ? <HomeInfoGotInvitation/> : null}
        </div>
      </div>
    </HomeContext.Provider>
  );
}