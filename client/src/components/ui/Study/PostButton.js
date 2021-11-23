import React, { useContext, useState, useEffect } from 'react';
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
    top: 75px;
    left: 250px;
`;

export default function PostButton(props) {
    // const shortenName = props.userId.substr(0, 2).toUpperCase();
    const POST_UPDATE_INTERVAL = 5000;

    const {loginUser} = useContext(LoginUserContext);
    const [chats, setchats] = useState([]);

    const [chatObj, setChatObj] = useState({});
    const [Msg, setMessage] = useState(null);

    const [newPost, setNewPost] = useState(false);
    const [show, setShow] = useState(false);   
    const [active, setActive] = useState(false);

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
    }, [chatObj, loginUser.userID]);

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

    const sendMessage = () => {
        console.log(Msg);
        setchats(chats.concat(`${loginUser.userID} : ${Msg}`));
        socket.emit('chat message', loginUser.userID, Msg);
        setMessage('');
    }

    const onChange = (e) => {
        setMessage(e.target.value);
    }

    const onButtonClick = () => {
        if (show){
            setShow(false);
            setActive(false);
            setChatObj({});
        }
        else {
            setShow(true);             
        }
    }

    return(
        <StyledDiv>
            <div className ={styles.outerContainer}>
                { active ?
                    <div className= {`${styles.postButton} ${styles.hvrGrow}`} 
                        style={props.buttonStyle} 
                        onClick={()=>onButtonClick()}>                    
                        New Stickies
                        {show?
                        <div className={styles.iconsRed}>arrow_circle_up</div>
                        :<div className={styles.iconsRed}>arrow_circle_down</div>}
                    </div>
                    :
                    <div className= {`${styles.postButton}`} 
                        style={props.buttonStyle} >
                        Stickies
                    </div>
                }
                {show ?
                    <div>
                        <PostOverlay 
                            posts = {chatObj}
                            setShow = {setShow}
                        ></PostOverlay>
                    </div>
                : 
                null}
            </div>
        </StyledDiv>
    )
}