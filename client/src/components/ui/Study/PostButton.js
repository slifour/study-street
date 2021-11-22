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

const StyledModal = styled(Modal)`
    position: absolute;  
    margin: auto;
    left: 2.5%;
    top: 20%;
    display: flex;
    justify-content: center;
    align-items: center;   
    background: #FFFFFF;
    box-shadow: 0px 4px 6px rgba(74, 74, 74, 0.25);
    border-radius: 14px;
`

export default function PostButton(props) {
    // const shortenName = props.userId.substr(0, 2).toUpperCase();
    const POST_UPDATE_INTERVAL = 5000;

    const {loginUser} = useContext(LoginUserContext);
    const nickname = loginUser.userID;
    const [chats, setchats] = useState([]);
    const [Msg, setMessage] = useState(null);
    const [isConnected, setIsConnected] = useState(socket.connected);

    const [newPost, setNewPost] = useState(false); // is there new post arrived?
    const [show, setShow] = useState(false); // show the posts?    
    const [active, setActive] = useState(false); // is the post button active? ("New Posts!" with red button)

    const addChatMessage = () => {
        let message = 'Connected to chat';
        setchats(chats.concat(message));
    }

    useEffect(() => {

        socket.emit('add user', nickname);

        socket.on('chatconnect', () => {
            setIsConnected(true);    
            addChatMessage();
        });
        socket.on('user joined', (data) =>{
        setchats(chats.concat(`${data.username} joined`));

        })
        socket.on('user left', (data) => {
        setchats(chats.concat(`${data.username} left`));

        });
        socket.on('chatdisconnect', () => {
        setIsConnected(false);
        });
        socket.on('chatSendFail', () => {
        let message = 'Cannot send message';
        setchats(chats.concat(message));
        });

        socket.on('chat message', (data) => {
            console.log("socket.on('chat message') data.sendname, loginUser.userID =", data.sendname, loginUser.userID )
            if(data.sendname === loginUser.userID){
                setchats(chats.concat(`${data.sendname} : ${data.message}`));
                // posts.push({userName : data.username, message : data.message});
                setNewPost(true);    
            }
        });

        // setchats([{'id': 'hyeon', 'msg' : 'hello'}, {'id': 'hyeon', 'msg' : 'hello'}, {'id': 'hyeon', 'msg' : 'hello'}])

        return () => {
            socket.off('chatconnect');
            socket.off('chatdisconnect');
            socket.off('chat message');
        };
    });

    useEffect(() => {
        // update()
        const activatePost = setInterval(() => {update();}, POST_UPDATE_INTERVAL);
        return () => {clearInterval(activatePost);};
    });      

    const update = () => {
        setNewPost(true);
        if(newPost){
            setActive(true);
        };        
    };

    const sendMessage = () => {
        console.log(Msg);
        setchats(chats.concat(`${nickname} : ${Msg}`));
        socket.emit('chat message', nickname, Msg);
        setMessage('');
    }

    const onChange = (e) => {
        setMessage(e.target.value);
    }

    const onButtonClick = () => {
        if (show){
            setShow(false);
            setActive(false);
        }
        else {
            setShow(true);             
        }
    }

    return(
        <StyledDiv>
            {active ?
            <div>
                <div className= {`${styles.postButton} ${styles.hvrGrow}`} 
                    style={props.buttonStyle} 
                    onClick={onButtonClick}>                    
                    New Stickies
                    {show?
                    <div className={styles.iconsRed}>arrow_circle_up</div>
                    :<div className={styles.iconsRed}>arrow_circle_down</div>}
                </div>                
                {show ?
                <PostOverlay postList = {chats} setShow = {setShow} onChange = {onChange} Msg ={Msg} sendMessage = {sendMessage}></PostOverlay>
                : 
                null}
            </div>         
            : 
            <div>
                <div className= {`${styles.postButton}`} 
                    style={props.buttonStyle} >
                    Stickies
                </div>
            </div>
            }         
        </StyledDiv>
    )
}