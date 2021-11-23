import React, { useContext, useState, useEffect, useRef } from 'react';
import { LoginUserContext } from "../../../App";
import socket from '../../../socket';
import styles from "./study.module.css";
import styled from 'styled-components';
import PostOverlay from './PostOverlay';
import Modal from 'react-overlays/Modal';

//const socketIo = require("socket.io");

const StyledDiv = styled.div`
    position: fixed;
    z-index: 1040;
    top: -10px;
    left: 100px;
`;

export default function PostButton(props) {
    // const shortenName = props.userId.substr(0, 2).toUpperCase();
    const POST_UPDATE_INTERVAL = 5000;

    const {loginUser} = useContext(LoginUserContext);

    const [chatObj, setChatObj] = useState({});
    const [curObj, setCurObj] = useState({});

    const [newPost, setNewPost] = useState(false);
    const [show, setShow] = useState(false);   
    const [active, setActive] = useState(false);
    const [reply, setReply] = useState(false);
    const [text, setText] = useState('');
    const [idx, setIdx] = useState(0);

    const [willUpdate, setWillUpdate] = useState(false);

    useEffect(() => {
        socket.emit('add user', loginUser.userID);

        socket.on('chat message', ({sendname, message}) => {
            console.log(sendname, message);

            let tempChatObj = {...chatObj};
            let date = new Date();
            let key = sendname + date.toString();
            tempChatObj[key] = {
                from: sendname,
                msg: message
            }
            setChatObj(tempChatObj);
            setNewPost(true);    
        });

        return () => {
            socket.off('chat message');
        };
    });

    useEffect(() => {
        if (willUpdate) {
            console.log(chatObj);
            if (newPost) {
                setActive(true);
            };
            setWillUpdate(false);
        }     
    }, [willUpdate, newPost, chatObj]);

    useEffect(() => {
        console.log(socket.id);
        const activatePost = setInterval(() => {
                setWillUpdate(true);
            }, POST_UPDATE_INTERVAL);
            return () => {
                clearInterval(activatePost);
            };
    }, []);      

    const onChange = (e) => {
        setText(e.target.value);
    }

    const onClose = () => {
        setShow(false);
        setActive(false);
        setReply(false);
        setText('');
        if (Object.keys(chatObj).length===0){
            setNewPost(false);
        }
    }
    const onButtonClick = () => {
        if (show){
            onClose();
        }
        else {
            setCurObj({...chatObj});
            setShow(true);
            setChatObj({});             
        }
    }

    const getText = () => {
        if (show && active){
            return "Close Stickies"
        } else {
            return "New Stickies"
        }
    }

    const handleReply = () => {
        socket.emit('chat message', loginUser.userID,
            curObj[Object.keys(curObj)[idx]].from, text);
        setReply(false);
        setText('');
    }

    return(
        <StyledDiv>
            <div className ={styles.outerContainer}>
                { active ?
                    <div className= {styles.postButton} 
                        onClick={()=>onButtonClick()}>                    
                        {getText()}
                        {show ?
                        <div className={styles.iconsSmallerRight}>close</div>
                        :
                        <div className={styles.iconsRed}>priority_high</div>}
                    </div>
                    :
                    <div className= {`${styles.postButton}`}>
                        Stickies
                    </div>
                }
                {show ?
                <div>
                    <div className = {styles.postContainer}>
                        <PostOverlay 
                            posts = {curObj}
                            setIdx = {setIdx}
                        ></PostOverlay>
                    </div>
                    { reply ?
                        <div className={styles.replyFooter}>
                            <input
                                type="text"
                                className={styles.replyInput}
                                value={text}
                                onChange={onChange}
                            ></input>
                            <div 
                                className={styles.replyButtonS} 
                                onClick={()=>handleReply()}
                            >
                                <div className={styles.iconsSmaller}>reply</div>
                            </div>
                        </div>
                    :
                        <div className={styles.replyFooter}>
                            <div 
                                className = {styles.replyButtonL} 
                                onClick={()=>setReply(true)}
                            >
                                <div className ={styles.iconsSmaller}>reply</div>
                                <div className ={styles.replyText}>Reply</div>
                            </div>
                        </div>
                    }
                </div>
                : 
                null}
            </div>
        </StyledDiv>
    )
}