import { useState } from "react"
import HomeUserAvatar from "./HomeUserAvatar";
import GroupIconList from "./GroupIconList";
import NewGroupButton from "./NewGroupButton";
import InvitationButton from "./InvitationButton";
import SettingButton from "./SettingButton";
import HomeInfoUser from "./HomeInfoUser";
import HomeInfoGroup from "./HomeInfoGroup";
import styles from "./home.module.css";
import Login from "../../User/LogIn";

export default function HomeMain(props) {
  const SHOW_USER = "SHOW_USER"
  const SHOW_GROUP = "SHOW_GROUP"

  const [currentShow, setCurrentShow] = useState(SHOW_USER);
  const [currentGroup, setCurrentGroup] = useState(null); // groupID

  const onSetGroup = (groupID) => {
    setCurrentGroup(groupID);
    setCurrentShow(SHOW_GROUP);
  }

  return (
    <div>
      <div className={styles.sidebar}>        
        <HomeUserAvatar></HomeUserAvatar>
        <GroupIconList onSetGroup={onSetGroup}></GroupIconList>
        <NewGroupButton></NewGroupButton>
        <InvitationButton></InvitationButton>
        <SettingButton></SettingButton>
      </div>
      <div className={styles.infoArea}>
        { currentShow === SHOW_USER ? <HomeInfoUser></HomeInfoUser> : null}
        { currentShow === SHOW_GROUP ? <HomeInfoGroup></HomeInfoGroup> : null}
      </div>
    </div>
  );
}