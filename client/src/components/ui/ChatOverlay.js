import React, { useContext, useState, useEffect } from 'react';
import { LoginUserContext } from "../../App";
import socket from '../../socket';
import styles from "./ui.module.css";
import styled from 'styled-components';
import { GameContext } from "../../App";

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

//const socketIo = require("socket.io");

export default function ChatOverlay(props) {
    const shortenName = props.userId.substr(0, 2).toUpperCase();

    const {loginUser} = useContext(LoginUserContext);
    const nickname = loginUser.userID;
    console.log("nickname:", loginUser, nickname)
    const [chats, setchats] = useState([]);
    //setchat에 메시지가 오면 props에 알림을 하는 on/off 함수를 하나 만들면 알림을 줄 수 있을 듯
    const chatlog = {}; //[]의 {} 꼴로 채팅방별로 백업해야 함! 방에 아이디를 부여해서 아이디별로 백업?
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [Msg, setMessage] = useState(null);
    const {game, gameEnableInput, gameDisableInput} = useContext(GameContext);

    const addChatMessage = () => {
        console.log("Connected to chat");
        let message = 'Connected to chat';
        setchats(chats.concat(message));
    }

    const loadChatLog = (clog) => {
        setchats(chats.concat(clog));
    }

    useEffect(() => {
        const disableInput = () => {
          console.log("Game: ", game.current);
          game.current.game.input.keyboard.enabled = false;
          game.current.game.input.mouse.enabled = false;
        } 
        disableInput();
        return () => {
          game.current.game.events.off("ready", disableInput);
          game.current.game.input.keyboard.enabled = true;
          game.current.game.input.mouse.enabled = true;
        }
      }, []);

    useEffect(() => {
        //이전 채팅 기록을 불러오는 함수
        //socket.emit('call chat log', chatlog);
        socket.emit('add user', nickname);

        socket.on('chatconnect', () => {
            setIsConnected(true);    
            addChatMessage();
        });
        socket.on('load chat log', (data) =>{
            loadChatLog(data.chatlog);
        })
        socket.on('user joined', (data) =>{
        if(data.username === props.userId){
            setchats(chats.concat(`${data.username} joined`));
        }
        //chatlog.concat(`${data.username} joined`);
        })
        socket.on('user left', (data) => {
        if(data.username === props.userId){
            setchats(chats.concat(`${data.username} left`));
        }
        //chatlog.concat(`${data.username} left`);
        });
        socket.on('chatdisconnect', () => {
        setIsConnected(false);
        });
        socket.on('chatSendFail', () => {
        let message = 'Cannot send message';
        setchats(chats.concat(message));
        });
        socket.on('chat message', (data) => {
        if(data.sendname === props.userId){
            setchats(chats.concat(`${data.sendname} : ${data.message}`));
        }
        //chatlog.concat(`${data.sendname} : ${data.message}`);
        });

        return () => {
        //socket.emit('chatdisconnect', nickname);
        socket.off('chatconnect');
        socket.off('chatdisconnect');
        socket.off('chat message');
        };
    });

    const sendMessage = () => {
        console.log(Msg);
        setchats(chats.concat(`${nickname} : ${Msg}`));
        //setchatlog(chatlog.concat(`${nickname} : ${Msg}`));
        socket.emit('chat message', nickname, props.userId, Msg);
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
                <div className = {styles.chatInputContainer}>
                    <input
                        type="text"
                        className = {styles.chatInput}
                        onChange={onChange} value={Msg} class="inputMessage" 
                        placeholder="Type here..." 
                        onKeyPress={(e)=>{
                            if(e.key === 'Enter')
                                sendMessage();
                        }}></input>
                </div>    
                <div className = {styles.chatButton}>
                    <div className={styles.hvrGrow}>
                        <span className={styles.iconsWhite} onClick={sendMessage}>send</span>
                    </div>
                </div>
            </div>
        </div>
    )
}