import React, { useEffect } from "react";
import GroupMemberList from "./GroupMemberList";
import GroupProgress from "./GroupProgress";
import styles from "./home.module.css";

export default function HomeInfoGroup({group}) {
  return (
    <div>
      <h1> {group.groupName} </h1>
      <GroupProgress group={group}/>
      <GroupMemberList group={group} />
    </div>
  );
}