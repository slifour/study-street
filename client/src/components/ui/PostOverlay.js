import React, { useContext, useState, useEffect, useRef } from 'react';
import { LoginUserContext } from "../../App";
import socket from '../../socket';
import styles from "./ui.module.css";
import styled from 'styled-components';
import HTMLFlipBook from "react-pageflip";

//const socketIo = require("socket.io");
const Page = React.forwardRef((props, ref) => {
    return (
      <div className = {styles.postContainer} ref={ref}> /* ref required */
        <h1>Page Header</h1>
        <p>{props.children}</p>
        <p>Page number: {props.number}</p>
      </div>
    );
});

const StyledDiv = styled.div`
    position: fixed;
    z-index: 1040;
    top: 10%;
    left: 10%;
`;

function Test (props) {    
    const {postList} = props;
    return(
    <div>
        {postList.map((post, index) => (
            <Page key={index} number="1">{post.msg}</Page>
        ))}
    </div>
    )
}; 

export default function PostOverlay(props) {
    // const {show, postList} = props;
    const {show} = props;

    const postList = [{id: 'hyeon', msg : 'hello'}, {id: 'hyeon', msg : 'hello'}, {id: 'hyeon', msg : 'hello'}];

    const [pageList, setpageList] = useState([])
    const flipBook = useRef(null);
    useEffect(() => {
        // setTimeOut(() => setValue(value+1), postUpdateInterval);

        return () => {
        };
    });

    const nextButtonClick = () => {
        flipBook.getPageFlip().flipNext();
    };
    
    const prevButtonClick = () => {
        flipBook.getPageFlip().flipPrev();
    };

    return(        
        // show?
        // <div className="postContainer">
        <StyledDiv>
            <HTMLFlipBook ref={flipBook} width={300} height={300} size="fixed" postList = {postList}>
                {/* <Page key={postList[0].msg} number="1">{postList[0].msg}</Page> */}
                {postList.map((post, index) => (
                    <Page key={post.msg} number="1">{post.msg}</Page>
                ))}
            {/* <Page number="1">Hi</Page> */}
            </HTMLFlipBook>
            <div>
                <button type="button" onClick={() => prevButtonClick}>
                    Previous
                </button>
                <button type="button" onClick={() => nextButtonClick}>
                    Next 
                </button>
            </div>
        </StyledDiv>
        // </div>
        // : null
    )
}