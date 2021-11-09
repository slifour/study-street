import React, { useContext, useEffect, useState, useRef } from 'react';
import styles from "./ui.module.css";
import { LoginUserContext } from '../../App';
import socket from '../../socket';
import GroupIcon from './GroupIcon';
import OverlayButton from './OverlayButton';
import GroupMemberList from './GroupMemberList';
import uniqueString from 'unique-string';
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';
import { GameContext } from '../../App';
// import Button from 'react-bootstrap/Button'

const StyledModal = styled(Modal)`
    position: fixed;
    width: 340px;
    height: 310px;
    z-index: 1040;
    bottom: 10%;
    left: 50%;
    border-radius: 8px;
    outline: none;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
`;

export default function ConfirmAlert(prop) {

    const [show, setShow] = useState(true);
    
    const inLibraryScene = prop.inLibraryScene
    const emitToGame = prop.emitToGame
    const confrimToRest = 'Pause study and have rest?' 
    const confrimToLibrary = 'Stop rest and go to study?'
    const confrimText = {inLibraryScene} ? confrimToRest: confrimToLibrary;
    const {game} = useContext(GameContext);
    // const toRestScene = useContext(SceneContext);

    return(
        <div>
            {/* <div className = {styles.tooltip}> */}
                <div className = {styles.tooltipHeader}>{confrimText}</div>
                <div className = {styles.tooltipParagraph}>Description</div>
                <div className = {styles.tooltipParagraph}>
                    <button 
                        variant="contained" 
                        onClick={()=>{
                            setShow(false);
                        }                            
                    }>No. keep here.</button>
                    <button 
                        variant="contained"
                        onClick={()=>{
                            emitToGame({inLibraryScene} ? 'toRestScene': 'toLibraryScene');
                            setShow(false);
                        }                        
                    }>Yes. Let's Move!</button>
                </div>
            </div>
        // </div>       
    )
}

export function QuickMoveButton(prop) {
    const inLibraryScene = prop.inLibraryScene
    const shiftText = inLibraryScene ? 'Return to Study' : 'Go to Rest';
    const emitToGame = prop.emitToGame
    return (        
        <OverlayButton text = {shiftText} buttonStyle = {{left: "20%", bottom: "20%"}}>
            <ConfirmAlert buttonStyle = {{left: "50%", bottom: "50%"}} emitToGame = {emitToGame} inLibraryScene = {inLibraryScene}></ConfirmAlert>
        </OverlayButton>
    );
}

// export default function ConfrimButton(props) {
//     const [show, setShow] = useState(false);
//     const renderBackdrop = props => <Backdrop {...props} />;
  
//     return (
//         <>
//         <div className={`${styles.overlayButton} ${styles.hvrGrow}`} style={props.buttonStyle} onClick={() => {setShow(true)}}>
//             {props.text}
//         </div> 
//         <StyledModal
//             show = {show}
//             onHide = {() => setShow(false)}
//             renderBackdrop = {renderBackdrop}>
//             {show ? props.children : null}
//         </StyledModal>
//         </>
//     );
// };
