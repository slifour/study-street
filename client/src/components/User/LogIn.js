import React, { useContext, useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { LoginUserContext } from "../../App";

function Login() {
  const [userID, setUserID] = useState("");
  const { loginUser, setLoginUser } = useContext(LoginUserContext);

  let requestedUserID = useRef(null);

  useEffect(() => {
    socket.on("userLoginFail", () => { 
      alert("Failed to login."); 
    });
    socket.on("userLoginOK", loginUserProfile => {
      if (!requestedUserID.current || requestedUserID.current != loginUserProfile.userID) {
        console.error("요청하지 않은 login 허용 응답을 받음");
        return;
      }
      setLoginUser(loginUserProfile);
    });
  }, []);

  const onChange = e => {
    setUserID(e.target.value);
  };

  /* 엔터를 눌렀을 때도 로그인이 되도록 합니다 */
  const onLoginKeyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onLoginClick();
    }
  };

  const onLoginClick = () => {
    requestedUserID.current = userID;
    socket.emit("userLoginRequest", userID);
  };

  return (
    <>
    {
      loginUser ? 
      null :
      <div>
        ID: <input onChange={onChange} onKeyUp={onLoginKeyUp} value={userID}></input>
        <button onClick={onLoginClick}>Log in</button>
      </div>
    }
    </>
  );
}

export default Login;