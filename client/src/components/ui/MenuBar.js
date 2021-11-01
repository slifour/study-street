import React from "react";
import styles from "./ui.module.css";
import IconButton from "./IconButton";

export default function MenuBar() {
    return (
        <div className={styles.menuBar}>
            <IconButton iconName={"today"}/>
            <IconButton iconName={"list_alt"}/>
            <IconButton iconName={"logout"}/>
            <IconButton iconName={"settings"}/>
        </div>
    )
}