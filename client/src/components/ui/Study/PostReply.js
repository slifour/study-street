import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from "./study.module.css";

export default function PostReply(props){

    const {onChange, Msg, sendMessage} = props;
    const {setIsReplying} = props;

    // const [isReplying, setIsReplying] = useState(true);

    const sendButtonClick = () => {
        setIsReplying(false);
    }    

    return (
        <>
        <div className = {styles.postPage}> 
            <form>
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
            <button type="button" onClick={() => sendButtonClick()}>
                Send
            </button>
        </div>      
        </>
    );
}
