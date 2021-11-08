import React, { useContext, useEffect, useState } from 'react';
import styles from "./ui.module.css";
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';

const StyledModal = styled(Modal)`
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

  return (
      <>
      <div className={`${styles.overlayButton} ${styles.hvrGrow}`} style={props.buttonStyle} onClick={() => {setShow(true)}}>
          {props.text}
      </div> 
      <StyledModal
          show = {show}
          onHide = {() => setShow(false)}
          renderBackdrop = {renderBackdrop}>
          {show ? props.children : null}
      </StyledModal>
      </>
  );
};