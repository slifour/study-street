import React, { useContext, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import HTMLFlipBook from "react-pageflip";
import PostPage from './PostPage'; 
import PostReply from './PostReply'; 
import PostCloseButton from './PostCloseButton';
import styles from "./study.module.css";

export default function PostOverlay(props) {
    // const {show, postList} = props;
    const {posts, setShow, onChange, Msg, sendMessage} = props;

    const [pageList, setpageList] = useState([])
    const [isReplying, setIsReplying] = useState(false);

    const flipBook = useRef(null);
    useEffect(() => {

    }, []);

    const nextButtonClick = () => {
        flipBook.getPageFlip().flipNext();
    };
    
    const prevButtonClick = () => {
        flipBook.getPageFlip().flipPrev();
    };
    
    const mapPages = () => {
        let returnComponents = [];
        for (let key in posts) {
            let post = posts[key];

            returnComponents.push(<PostPage
                key = {key}
                post = {post}
            ></PostPage>)
        }
        return returnComponents.map(el => el)
    }
    // const onClickPostClose = () => {
    //     setShow(false);
    // }

    return(        
        <div className = {styles.innerContainer}>
            <div className = {styles.buttonFlip} onClick= {() => prevButtonClick}>
                <div className = {styles.icons}>chevron_left</div>
            </div>
            <div className = {styles.page}>
                <HTMLFlipBook ref={flipBook} width={280} height={300} size="fixed">
                    {mapPages()}
                </HTMLFlipBook>
            </div>
            <div className = {styles.buttonFlip} onClick = {() => nextButtonClick}>
                <div className = {styles.icons}>chevron_right</div>
            </div>
        </div>
        // <>
        // <div className={styles.postAreaContainer}>
        // {/* // <div className="postContainer"> */}        
        //     <HTMLFlipBook ref={flipBook} width={280} height={300} size="fixed" postList = {postList}>
        //         {/* <Page key={postList[0].msg} number="1">{postList[0].msg}</Page> */}
        //         {postList.map((post, index) => (
        //             <PostPage key={post.msg} post={post} onChange = {onChange} Msg ={Msg} sendMessage = {sendMessage}></PostPage>
        //         ))}
        //     {/* <Page number="1">Hi</Page> */}
        //     </HTMLFlipBook>
        //     {isReplying? <PostReply setIsReplying = {setIsReplying}></PostReply> : null}    
        //     <div className={styles.postButtonSmall} onClick={replyButtonClick}>Reply</div>
                 
        //     <div>
        //         <button type="button" onClick={() => prevButtonClick}>
        //             Previous
        //         </button>
        //         <button type="button" onClick={() => nextButtonClick}>
        //             Next 
        //         </button>
        //     </div>            
        // </div>
        // {/* : null} */}
        // </>
    )
}