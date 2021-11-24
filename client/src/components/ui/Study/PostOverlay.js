import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from "react-pageflip";
import PostPage from './PostPage'; 
import styles from "./study.module.css";

export default function PostOverlay(props) {
    // const {show, postList} = props;
    const {posts, setIdx} = props;
    const [num, setNum] = useState(0);
    const flipBook = useRef(null);

    useEffect(()=>{
        setIdx(num);
    }, [num])

    const nextButtonClick = () => {
        flipBook.current.pageFlip().flipNext();
        setNum(num+1);
    };
    
    const prevButtonClick = () => {
        flipBook.current.pageFlip().flipPrev();
        setNum(num-1);
    };
    
    const mapPages = () => {
        let returnComponents = [];
        let i = 1;
        for (let key in posts) {
            let post = posts[key];

            returnComponents.push(<PostPage
                key = {key}
                post = {post}
                num = {Object.keys(posts).length}
                idx = {i}
            ></PostPage>)
            i += 1;
        }
        return returnComponents.map(el => el)
    }

    return(        
        <div className = {styles.innerContainer}>
            <div className = {styles.buttonFlip} onClick= {() => prevButtonClick()}>
                <div className = {styles.icons}>chevron_left</div>
            </div>
            <div className = {styles.page}>
                <HTMLFlipBook 
                    ref = {flipBook} 
                    width = {260} 
                    height = {290} 
                    size = "fixed"
                    useMouseEvents = {false}
                >
                    {mapPages()}
                </HTMLFlipBook>
            </div>
            <div className = {styles.buttonFlip} onClick = {() => nextButtonClick()}>
                <div className = {styles.icons}>chevron_right</div>
            </div>
        </div>
    )
}