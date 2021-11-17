import React, { useContext, useState, useEffect } from 'react';
import { LoginUserContext } from "../../App";
import socket from '../../socket';
import styles from "./ui.module.css";
import styled from 'styled-components';
import PostOverlay from './PostOverlay';

//const socketIo = require("socket.io");

const StyledDiv = styled.div`
    position: absolute;
    z-index: 1040;
    top: 5%;
    left: 10%;
`;

export default function PostButton(props) {
    // const shortenName = props.userId.substr(0, 2).toUpperCase();

    const {loginUser} = useContext(LoginUserContext);
    const nickname = loginUser.userID;
    console.log("nickname:", loginUser, nickname)
    const [chats, setchats] = useState([]);
    // const [posts, setPosts] = useState([]);
    let [posts, setPosts] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [Msg, setMessage] = useState(null);

    const [postUpdateInterval, setpostUpdateInterval] = useState(5*60*1000);
    const [newPost, setNewPost] = useState("false");
    const [show, setShow] = useState("true");
    const [active, setActive] = useState("false");
    const [buttonText, setButtonText] = useState("Stickies");

    const addChatMessage = () => {
        let message = 'Connected to chat';
        setchats(chats.concat(message));
    }

    useEffect(() => {
        
        socket.emit('add user', props.userId);

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
        socket.on('chat message', (data) => {
            posts.push({userName : data.username, message : data.message});
            setNewPost(true);
        //  setPosts(chats.(`${data.username} : ${data.message}`)); //수정 필요
        });

        posts = [{'id': 'hyeon', 'msg' : 'hello'}, {'id': 'hyeon', 'msg' : 'hello'}, {'id': 'hyeon', 'msg' : 'hello'}]
        // setTimeOut(() => setActive(true), postUpdateInterval);

        return () => {
            socket.off('chatconnect');
            socket.off('chatdisconnect');
            socket.off('chat message');
        };
    });

    const sendMessage = () => {
        console.log(Msg);
        setchats(chats.concat(`${nickname} : ${Msg}`));
        socket.emit('chat message', nickname, Msg);
        setMessage('');
    }

    const onChange = (e) =>{
        setMessage(e.target.value);
    }

    return(
        <styledDiv>
        {active ?
            <div>
            <div className= {`${styles.overlayButton} ${styles.hvrGrow}`} 
                style={props.buttonStyle} 
                buttonStyle = {{left: "20%", bottom: "80%"}} 
                onClick={() => {setShow(true)}}>
                {buttonText}
            </div>
            <PostOverlay postList = {posts} show = {show} setshow = {setShow} ></PostOverlay>
            </div> :        
            <div>
                <div className= {`${styles.overlayButton}`} 
                style={props.buttonStyle} 
                buttonStyle = {{left: "20%", bottom: "80%"}} 
                onClick={() => {setShow(true)}}>
                    {buttonText}
                </div>
            </div>
        }            
        </styledDiv>
    )
}