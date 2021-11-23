import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from "./study.module.css";

const PostPage = React.forwardRef((props, ref) => {
    const {post} = props;

    return (
        <>
        <div className = {styles.postPags} ref={ref}>
            <p>From {post.from} :</p>
            <p>{post.msg}</p>
        </div>
        </>
    );
});

export default PostPage;