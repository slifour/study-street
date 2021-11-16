import React from "react";
import styles from "./home.module.scss";
import uiStyles from "../ui.module.css";



export default function InvitationButton() {
  return (
    <div className={styles.sidebarItem}>
      <span className={uiStyles.icons}>mail</span>
    </div>
  );
}