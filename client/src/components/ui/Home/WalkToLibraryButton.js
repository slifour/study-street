import React from "react";
import styles from "./home.module.css";
import uiStyles from "../ui.module.css";

export default function WalkToLibraryButton({onClick, children, disabled}) {
  return (
    <>
    {
      disabled ?
      <div className={`${styles.walkButton} ${styles.disabledImage}`}>
        <img src="/assets/images/door.png" alt="Walking to library is disabled"/>
        <p>{children}</p>
      </div>
      :
      <div className={styles.walkButton} onClick={onClick}> 
        <img src="/assets/images/door.png" alt="Walk to library"/>
        <p>{children}</p>
      </div>
    }
    </>
  );
}