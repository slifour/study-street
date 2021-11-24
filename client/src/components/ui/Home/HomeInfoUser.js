import React, { useContext } from "react";
import { LoginUserContext } from "../../../App";
import styles from "./home.module.css";
import UserAvatarCircle from "../UserAvatarCircle";
import UserAvatarSpritePreview from "./UserAvatarSpritePreview";

export default function HomeInfoUser() {
  const {loginUser} = useContext(LoginUserContext);

  return (
    <div>
      <h1>
        {loginUser.userName}
      </h1>
      <UserAvatarCircle user={loginUser}/>
      <h2> Avatar </h2>
      <UserAvatarSpritePreview user={loginUser}/>
      <h2> Status </h2>
      <p> {loginUser.status} </p>
    </div>
  );
}