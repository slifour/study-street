import React, {useState} from "react";
import styles from "./ui.module.css";
import styled from "styled-components";
import Modal from 'react-overlays/Modal';
import ChecklistContainer from './ChecklistContainer';

const StyledModal = styled(Modal)`
    position: fixed;
    width: 800px;
    height: 900px;
    z-index: 1040;
    bottom: -3%;
    right: 3%;
    border-radius: 11px;
    outline: none;
    background-color: #FBFBFB;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
`;

const Backdrop = styled("div")`
    position: fixed;
    z-index: 1040;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    opacity: 0.2;
`;

export default function IconButton(props) {
    const [onHover, setOnHover] = useState(false);
    const [openChecklist, setOpenChecklist] = useState(false);
    const renderBackdrop = (props) => <Backdrop {...props} />;

    const handleClick = () => {
        if (props.iconName == 'list_alt'){
            setOpenChecklist(true);
        } 
    }
    return (
        <div>
            <div
                className={styles.iconButtonContainer}
                className={styles.hvrGrow}
                onMouseEnter={()=>setOnHover(true)}
                onMouseLeave={()=>setOnHover(false)}
                onClick = { () => handleClick()}
                >
                <span className={styles.icons}>{props.iconName}</span>
                
            </div>
            <StyledModal
                    show = {openChecklist}
                    onHide = {() => setOpenChecklist(false)}
                    renderBackdrop = {renderBackdrop}
            ><ChecklistContainer></ChecklistContainer>
            </StyledModal>
        </div>
    )
}