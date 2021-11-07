import React, { useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { LoginUserContext } from "../../App";

function UserInfo() {
  const { loginUser, setLoginUser } = useContext(LoginUserContext);
  return (
    <>
      {
        loginUser ? 
        <div> Name: {loginUser.userName} </div>
        : <div> (Not logged in.) </div>
      }
    </>
  );
}

export default UserInfo;