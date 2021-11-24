import React from 'react';
import styles from "./study.module.css";

const PostPage = React.forwardRef((props, ref) => {
    const {post, num, idx} = props;

    return (
        <div ref={ref}>
            <div className={styles.pageContent}>
                <div className={styles.pageText}>From {post.from} :</div>
                <div className={styles.pageText}>{post.msg}</div>
            </div>
            <div className={styles.pageIndex}>{idx}/{num}</div>
        </div>
    );
});

export default PostPage;