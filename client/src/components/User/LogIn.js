import React, { useContext, useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { LoginUserContext } from "../../App";
import uniqueString from 'unique-string';
import styled from "styled-components";

const StyledLogin = styled.div`
  position: absolute;
  right: 10%;
`;

function Login() {
  const [userID, setUserID] = useState("");
  const { loginUser, setLoginUser } = useContext(LoginUserContext);

  // let requestedUserID = useRef(null);
  let usedRequestKeyRef = useRef(null);

  // useEffect(() => {
  //   socket.on("userLoginFail", () => { 
  //     alert("Failed to login."); 
  //   });
  //   socket.on("userLoginOK", loginUserProfile => {
  //     if (!requestedUserID.current || requestedUserID.current != loginUserProfile.userID) {
  //       console.error("요청하지 않은 login 허용 응답을 받음");
  //       return;
  //     }
  //     setLoginUser(loginUserProfile);
  //   });
  // }, []);

  const onResponse = ({ requestKey, status, payload }) => {
    console.log("Response: ", requestKey);
    console.log("My key: ", usedRequestKeyRef.current);
    if (requestKey === usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK": 
          setLoginUser(payload);
          break;
        case "STATUS_FAIL": 
          alert(payload.msg || "Failed to login (client msg)");
          break;
      }
    }
  };

  useEffect(() => {
    const responseType = "RESPONSE_LOGIN";
    socket.on(responseType, onResponse);
    return () => {socket.off(responseType, onResponse);};
  }, []);

  const onLoginClick = () => {
    const requestType = "REQUEST_LOGIN";
    usedRequestKeyRef.current = uniqueString();
    socket.emit(requestType, {
      requestUser: null,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: { userID }
    });
  }

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

  // const onLoginClick = () => {
  //   requestedUserID.current = userID;
  //   socket.emit("userLoginRequest", userID);
  // };

  return (
    <>
    {
      loginUser ? 
      null :
      <StyledLogin>
        ID: <input onChange={onChange} onKeyUp={onLoginKeyUp} value={userID}></input>
        <button onClick={onLoginClick}>Log in</button>
      </StyledLogin>
    }
    </>
  );
}

export default Login;