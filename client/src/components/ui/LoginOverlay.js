import React, { useContext, useEffect, useRef, useState } from "react";
import socket from "../../socket";
import styles from './login.module.css';
import { LoginUserContext } from "../../App";
import uniqueString from 'unique-string';

export default function LoginOverlay(props) {
    const [userID, setUserID] = useState('');
    const { loginUser, setLoginUser } = useContext(LoginUserContext);
    let usedRequestKeyRef = useRef(null);

    const onResponse = ({ requestKey, status, payload }) => {
        console.log("Response: ", requestKey);
        console.log("My key: ", usedRequestKeyRef.current);
        if (requestKey === usedRequestKeyRef.current) {
          switch (status) {
            case "STATUS_OK": 
                setLoginUser(payload);
                props.callClose();
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
    
    const changeUserID = (e) => {
        setUserID(e.target.value);
    }

    const onLoginKeyUp = e => {
        if (e.keyCode === 13 && loginUser===null) {
            e.preventDefault();
            onLoginClick();
        }
      };


    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginHeader}>
                <img src = "assets/images/bookArtifact.png" className={styles.loginIcon}></img>
                <div className={styles.loginTitle}>Login</div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.loginContent}>
                <div className={styles.loginContentText}>ID</div>
                <form className={styles.loginForm}>
                    <input
                        type = "text"
                        className={styles.loginInput}
                        value={userID}
                        onChange={changeUserID}
                        onKeyUp={onLoginKeyUp}
                    ></input>
                </form>
            </div>
            <div className={styles.loginFooter}>
                {(userID==='') && <div className={styles.loginButtonDisabled}>Login</div>}
                {(userID!=='') && <div
                    className={styles.loginButton}
                    onClick={onLoginClick}
                >Login</div>}
            </div>
        </div>
    )
}