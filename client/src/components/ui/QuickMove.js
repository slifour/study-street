import React, { useContext, useEffect, useState, useRef } from 'react';
import styles from "./ui.module.css";
import OverlayButton from './OverlayButton';
import { GameContext } from '../../App';
// import Button from 'react-bootstrap/Button'

export function ConfirmAlert(prop) {

    const show = prop.show;
    const setShow = prop.setShow;
    const { scene, emitToGame } = useContext(GameContext);
    const confirmQuestions = {
        'Rest' : 'Pause study and have rest?', 
        'Library' : 'Stop rest and go to study?',
        'Study' : 'Pause study and exit to library?',
    }
    const emits = {
        'Rest' : 'restToLibrary', 
        'Library' : 'libraryToRest',
        'Study' : 'studyToLibrary',
    }

    return(      
        show?     
        <div>
            {/* <div className = {styles.tooltip}> */}
            <div className = {styles.tooltipHeader}>{confirmQuestions[scene]}</div>
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
                        emitToGame(emits[scene]);
                        setShow(false);
                    }                        
                }>Yes. Let's Move!</button>
            </div>
            {/* </div> */}
        </div> : null     
    )
}

export function QuickMoveButton(prop) {
    const { scene, emitToGame } = useContext(GameContext);
    const buttonText = {
        'Rest': 'Return to Study',
        'Library': 'Go to Rest',
        'Study': 'Exit to Library',
    }
    const shiftText = buttonText[scene];    

    return (        
        <OverlayButton text = {shiftText} buttonStyle = {{left: "20%", bottom: "20%"}} id = "QuickMove">
            <ConfirmAlert buttonStyle = {{left: "50%", bottom: "50%"}}></ConfirmAlert>
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
