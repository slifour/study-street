import React from "react";
import styles from "./home.module.css";

export default function HomeInfoCloseButton({onClick}) {
  return (
    <button onClick={onClick} className={styles.homeInfoCloseButton}>
      <span className={styles.icons}>close</span>
    </button>
  );
}