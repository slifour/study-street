import React from 'react';
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
export default function ChatOverlay(props) {
    const shortenName = props.userId.substr(0, 2).toUpperCase();

    return(
        <div className = {styles.chatContainer}>
            <div className = {styles.chatHeader}>
                <StyledIcon color={props.color}>{shortenName}</StyledIcon>
                <div className = {styles.chatName}>{props.userId}</div>
            </div>
            <hr className={styles.styledHr}/>
            <div className={styles.chatContent}></div>
            <hr className={styles.styledHr}/>
            <div className = {styles.chatFooter}>
                <form className = {styles.chatInputContainer}>
                    <input type="text"  className = {styles.chatInput}></input>
                </form>    
                <div className = {styles.chatButton}>
                    <div className={styles.hvrGrow}>
                        <span className={styles.iconsWhite}>send</span>
                    </div>
                </div>
            </div>
        </div>
    )
}