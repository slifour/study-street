import React, { useContext, useState, useEffect, useRef } from 'react';
import { LoginUserContext } from "../../App";
import socket from '../../socket';
import styles from "./ui.module.css";
import styled from 'styled-components';
import HTMLFlipBook from "react-pageflip";
import PostPage from './PostPage'; 
import PostReply from './PostReply'; 

const StyledDiv = styled.div`
    position: fixed;
    z-index: 1040;
    top: 10%;
    left: 10%;
`;

//const socketIo = require("socket.io");
// function Reply() {
//     return (
//         <div className = {styles.postContainer} ref={ref}> /* ref required */
//                 <form className = {styles.chatInputContainer}>
//                     <input
//                         type="text"
//                         className = {styles.chatInput}
//                         onChange={onChange} value={Msg} class="inputMessage" 
//                         placeholder="Type here..." 
//                         onKeyPress={(e)=>{
//                             if(e.key === 'Enter')
//                                 sendMessage();
//                         }}></input>
//                 </form> 
//             <button type="button" onClick={() => {}}>
//                 Send
//             </button>
//         </div>
//     );
// }

// const Page = React.forwardRef((props, ref) => {
//     const {post, onChange, Msg, sendMessage} = props;
//     const [showReply, setShowReply] = useState(false);

//     const replyButtonClick = () => {
//         setShowReply(true)
//     }

//     return (
//         <>
//         <div className = {styles.postContainer} ref={ref}> /* ref required */
//             <p>From {post.id} :</p>
//             <p>{post.msg}</p>
//             <button type="button" onClick={() => replyButtonClick()}>
//                 Reply
//             </button>
//         </div>
//         {showReply? <PostReply onChange = {onChange} Msg ={Msg} sendMessage = {sendMessage} ></PostReply> : null }
//         </>
//     );
// });


export default function PostOverlay(props) {
    // const {show, postList} = props;
    const {onChange, Msg, sendMessage} = props;

    const postList = [{id: 'hyeon', msg : 'hello'}, {id: 'hyeon', msg : 'hello'}, {id: 'hyeon', msg : 'hello'}];

    const [pageList, setpageList] = useState([])
    const [isReplying, setIsReplying] = useState(false);

    const flipBook = useRef(null);
    useEffect(() => {

    }, [isReplying]);

    const replyButtonClick = () => {
        setIsReplying(true)
    }

    const nextButtonClick = () => {
        flipBook.getPageFlip().flipNext();
    };
    
    const prevButtonClick = () => {
        flipBook.getPageFlip().flipPrev();
    };

    return(        
        <>
        {/* {show? */}
        <div>
        {/* // <div className="postContainer"> */}
        <StyledDiv>
            <HTMLFlipBook ref={flipBook} width={300} height={300} size="fixed" postList = {postList}>
                {/* <Page key={postList[0].msg} number="1">{postList[0].msg}</Page> */}
                {postList.map((post, index) => (
                    <PostPage key={post.msg} post={post} onChange = {onChange} Msg ={Msg} sendMessage = {sendMessage}></PostPage>
                ))}
            {/* <Page number="1">Hi</Page> */}
            </HTMLFlipBook>
            {isReplying? <PostReply setIsReplying = {setIsReplying}></PostReply> : null}    
            <button type="button" onClick={() => replyButtonClick()}>
                Reply
            </button>        
            <div>
                <button type="button" onClick={() => prevButtonClick}>
                    Previous
                </button>
                <button type="button" onClick={() => nextButtonClick}>
                    Next 
                </button>
            </div>
        </StyledDiv>
        </div>
        {/* : null} */}
        </>
    )
}