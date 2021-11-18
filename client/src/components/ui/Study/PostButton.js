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
    console.log("nickname:", loginUser, nickname)
    const [chats, setchats] = useState([]);
    // const [posts, setPosts] = useState([]);
    let [posts, setPosts] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [Msg, setMessage] = useState(null);

    const [postUpdateInterval, setpostUpdateInterval] = useState(5*60*1000);
    const [newPost, setNewPost] = useState(false);
    const [show, setShow] = useState(false);
    // const [showReply, setShowReply] = useState("false");
    
    const [active, setActive] = useState(false);
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

        // useEffect(() => {
        //     console.log("check whether we will update user study time");
        //     if (willUpdateStudyTime) {
        //       requestUpdate();
        //       setWillUpdateStudyTime(false);
        //     }
        // }, [willUpdateStudyTime, requestUpdate]);   
  

        return () => {
            socket.off('chatconnect');
            socket.off('chatdisconnect');
            socket.off('chat message');
        };
    });

    const update = () => {
        setNewPost(true);
        if(newPost){
            setActive(true);
        };        
    };

    // useEffect(() => {
    //     if(active){
    //         setButtonText("New Stickies");
    //     }
    // })

    useEffect(() => {
        const activatePost = setInterval(() => {update();}, POST_UPDATE_INTERVAL);
        return () => {clearInterval(activatePost);};
    });      

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
            <div>
            {active ?
            <div>
                <div className= {`${styles.postButton} ${styles.hvrGrow}`} 
                    style={props.buttonStyle} 
                    // buttonStyle = {{left: "20%", bottom: "80%"}} 
                    onClick={onButtonClick}>                    
                    New Stickies
                    {show?
                    <div className={styles.iconsRed}>arrow_circle_up</div>:<div className={styles.iconsRed}>arrow_circle_down</div>}
                </div>                
                {show?
                <PostOverlay postList = {posts} setShow = {setShow} onChange = {onChange} Msg ={Msg} sendMessage = {sendMessage}></PostOverlay>
                :null}
            </div> :        
            <div>
                <div className= {`${styles.postButton}`} 
                style={props.buttonStyle} 
                // buttonStyle = {{left: "20%", bottom: "80%"}} 
                >
                    Stickies
                </div>
            </div>
            }      
            </div>      
        </StyledDiv>
    )
}