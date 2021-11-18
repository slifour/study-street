import React, { useContext, useEffect, useState } from 'react';
import styles from "./ui.module.css";
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';

const modalStyles = {
    "GroupList" : `
    position: fixed;
    width: 340px;
    height: 310px;
    z-index: 1040;
    bottom: 10%;
    left: 20%;
    border-radius: 8px;
    outline: none;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
    `,
    
    "QuickMove" : `    
    position: fixed;
    width: 447px;
    height: 229px;
    z-index: 1040;
    bottom: 50%;
    left: 50%;
    border-radius: 8px;
    outline: none;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;   
    `, 

    "QuickMoveNew" : `    
    position: fixed;
    width: 300px;
    height: 60px;
    margin: auto;
    bottom: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;

    background: #FFFFFF;
    box-shadow: 0px 4px 10px rgba(47, 47, 47, 0.25);
    border-radius: 30.5px;

    font-family: 'Lato', sans-serif;
    font-style: italic;
    font-size: 14px;
    font-weight: 300;
    `
}

/** 
 * OverlayButton UI 를 재사용하면 좋을 것 같아서
 * modalStyles dictionary에서 버튼의 id를 키로 클릭했을 때 나타날 modal style 을 선택할 수 있도록 했습니다.
  */
const StyledModal = styled(Modal)`
    ${props => modalStyles[props.id]}
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

export default function OverlayButton(props) {
  const [show, setShow] = useState(false);
  const renderBackdrop = props => <Backdrop {...props} />;
  const id = props.id;
  console.log('OverlayButton:', id);

  return (
      <>
      <div className={`${id === "QuickMove"? styles.quickMove : styles.overlayButton} ${styles.hvrGrow}`} style={props.buttonStyle} onClick={() => {setShow(true)}}>
          {props.text}
      </div> 
      <StyledModal
          id = {id}
          show = {show}
          onHide = {() => setShow(false)}
          renderBackdrop = {renderBackdrop}>
          {show ? React.cloneElement(props.children, {show : show, setShow : setShow}) : null}
      </StyledModal>
      </>
  );
};
