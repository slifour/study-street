import React, { useState, useLocation, useEffect } from 'react';
import socket from '../../socket';
import styles from "./ui.module.css";
import styled from 'styled-components';

const StyledIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;

    color: #FDFDFD;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;

    background: ${props => props.color};
`;

function addChat () {
    /* implement here */
}

//const socketIo = require("socket.io");

export default function ChatOverlay(props) {
    const shortenName = props.userId.substr(0, 2).toUpperCase();

    //const location = useLocation();
    //const nickname = location.state.nickname;
    const [chats, setchats] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [Msg, setMessage] = useState(null);

    const addChatMessage = (data) => {
        let message = '';
        if (data.numUsers === 1) {
        message += `there's 1 participant`;
        } else {
        message += `there are ${data.numUsers} participants`;
        }
        setchats(chats.concat(message));
    }

    useEffect(() => {
        
        socket.emit('add user', props.userId);
        
        socket.on('login', (data) => {
        setIsConnected(true);    
        addChatMessage(data);
        });
        socket.on('user joined', (data) =>{
        setchats(chats.concat(`${data.username} joined`));
        })
        socket.on('user left', (data) => {
        setchats(chats.concat(`${data.username} left`));
        });
        socket.on('disconnect', () => {
        setIsConnected(false);
        });
        socket.on('chat message', (data) => {
        setchats(chats.concat(`${props.userId} : ${data.message}`)); //수정 필요
        });
        return () => {
        socket.off('login');
        socket.off('disconnect');
        socket.off('chat message');
        };
    });

    const sendMessage = () => {
        console.log(Msg);
        setchats(chats.concat(`${props.userId} : ${Msg}`));
        socket.emit('chat message', Msg);
        setMessage('');
    }

    const onChange = (e) =>{
        setMessage(e.target.value);
    }

    return(
        <div className = {styles.chatContainer}>
            <div className = {styles.chatHeader}>
                <StyledIcon color={props.color}>{shortenName}</StyledIcon>
                <div className = {styles.chatName}>{props.userId}</div>
            </div>
            <div className="scrollBlind">
            <ul class ="message">
                {chats.map((val, index) => {
                return (<li key={index}>{val}</li>);
                })}
            </ul>
            </div>
            <hr className={styles.styledHr}/>
            <div className={styles.chatContent}></div>
            <hr className={styles.styledHr}/>
            <div className = {styles.chatFooter}>
                <form className = {styles.chatInputContainer}>
                    <input
                        type="text"
                        className = {styles.chatInput}
                        onChange={onChange} value={Msg} class="inputMessage" 
                        placeholder="Type here..." 
                        onKeyPress={(e)=>{
                            if(e.key === 'Enter')
                                sendMessage();
                        }}></input>
                </form>    
                <div className = {styles.chatButton}>
                    <div className={styles.hvrGrow}>
                        <span className={styles.iconsWhite} onClick={sendMessage}>send</span>
                    </div>
                </div>
            </div>
        </div>
    )
}