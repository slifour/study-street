import React from "react";
import styles from "./home.module.css";
import uiStyles from "../ui.module.css";



export default function InvitationButton() {
  return (
    <div className={styles.sidebarItem}>
      <span className={uiStyles.icons}>mail</span>
    </div>
  );
}