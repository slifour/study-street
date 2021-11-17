import React, { useContext } from "react";
import { LoginUserContext } from "../../../App";
import styles from "./home.module.css";
import UserAvatarCircle from "../UserAvatarCircle";

export default function HomeInfoUser() {
  const {loginUser} = useContext(LoginUserContext);

  return (
    <div>
      <h1>
        {loginUser.userName}
      </h1>
      <div>
        <UserAvatarCircle user={loginUser}/>
      </div>
      <div>
        {loginUser.status}
      </div>
    </div>
  );
}