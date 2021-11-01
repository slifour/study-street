import React, {useState} from "react";
import styles from "./ui.module.css";

export default function IconButton(props) {
    const [onHover, setOnHover] = useState(false);

    return (
        <div className={styles.iconButtonContainer} className={styles.hvrGrow} onMouseEnter={()=>setOnHover(true)} onMouseLeave={()=>setOnHover(false)}>
            {/* {!onHover && <span className={styles.icons}>{props.iconName}</span>}
            {onHover && <span className={styles.iconsOnHover}>{props.iconName}</span>} */}
            <span className={styles.icons}>{props.iconName}</span>
        </div>
    )
}