import React from "react";
import styles from "./home.module.scss";

export default function HomeInfoCloseButton({onClick}) {
  return (
    <button onClick={onClick} className={styles.homeInfoCloseButton}>
      <span className={styles.icons}>close</span>
    </button>
  );
}