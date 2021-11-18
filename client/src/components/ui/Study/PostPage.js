import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from "./study.module.css";

const PostPage = React.forwardRef((props, ref) => {
    const {post, onChange, Msg, sendMessage} = props;
    const [showReply, setShowReply] = useState(false);

    return (
        <>
        <div className = {styles.postContainer} ref={ref}>
            <p>From {post.id} :</p>
            <p>{post.msg}</p>

        </div>
        </>
    );
});

export default PostPage;