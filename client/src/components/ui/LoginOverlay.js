import React, { useContext, useEffect, useRef, useState } from "react";
import socket from "../../socket";
import styles from './login.module.css';
import { LoginUserContext, GameContext } from "../../App";
import uniqueString from 'unique-string';
import UserAvatarSpriteSelection from "./UserAvatarSpriteSelection";

export default function LoginOverlay(props) {
    const [ userID, setUserID ] = useState('');
    const [ avatarID, setAvatarID ] = useState('1');
    const { loginUser, setLoginUser } = useContext(LoginUserContext);
    const { emitToGame } = useContext(GameContext);
    const spriteIDList = ['1','2','3','4'];
    const [ selectedSprite, setSelectedSprite ] = useState('user_1');
    let usedRequestKeyRef = useRef(null);

    const onResponse = ({ requestKey, status, payload }) => {
        console.log("Response: ", requestKey);
        console.log("My key: ", usedRequestKeyRef.current);
        if (requestKey === usedRequestKeyRef.current) {
          switch (status) {
            case "STATUS_OK": 
                setLoginUser(payload);
                emitToGame("EVENT_ID", payload);
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
        if (userID === 'hyeon'){
            console.log('HYEEEEEON')
            setSelectedSprite('user_5')
        }
        socket.emit(requestType, {
            requestUser: null,
            requestKey: usedRequestKeyRef.current,
            requestType,
            payload: { userID : userID, avatarSprite : selectedSprite }
        });
    }
    
    const changeUserID = (e) => {
        setUserID(e.target.value);
        setAvatarID('1');
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
                <div className={styles.loginContentText}>Avatar</div>  
                <div className={styles.loginContent}>
                { spriteIDList.map(spriteID => (
                    <UserAvatarSpriteSelection avatarSprite={`user_${spriteID}`} width={40} onClick={()=>setSelectedSprite(`user_${spriteID}`)} selected={`user_${spriteID}` === selectedSprite}/>
                )) }
                </div>           
            </div>
            <div className={styles.loginContent}>
                <div className={styles.loginContentText}>ID</div>
                <div className={styles.loginForm}>
                    <input
                        type = "text"
                        className={styles.loginInput}
                        value={userID}
                        onChange={changeUserID}
                        onKeyUp={onLoginKeyUp}
                    ></input>
                </div>
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