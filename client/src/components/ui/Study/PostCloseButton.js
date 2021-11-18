import React from "react";
import styles from "./study.module.css";

export default function PostCloseButton({onClick}) {
  return (
    <button onClick={onClick} className={styles.postCloseButton}>
      <span className={styles.icons}>close</span>
    </button>
  );
}