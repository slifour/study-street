import React, { useState, useEffect } from "react";
import socket from "../../socket";

function Login({onLogin}) {
  const [userID, setUserID] = useState("");

  useEffect(() => {
    socket.on("userLoginFail", () => { 
      alert("로그인에 실패했어요."); 
      setUserID("");
    });
    socket.on("userLoginOK", userID => {
      onLogin(userID);
    });
    return () => {};
  }, [onLogin]);

  const onChange = e => {
    setUserID(e.target.value);
  }
  const onLoginClick = () => {
    socket.emit("userLoginRequest", userID);
  };

  return (
    <div>
      ID: <input onChange={onChange} value={userID}></input>
      <button onClick={onLoginClick}>로그인</button>
    </div>
  );
}

export default Login;