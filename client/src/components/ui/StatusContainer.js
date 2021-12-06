
import React, { useState, useContext, useCallback, useEffect } from 'react';
import styles from './checklist.module.css'
import styled from 'styled-components';
import SingleChecklist from './SingleChecklist';
import uniqueString from 'unique-string';
import StatusInput from './StatusInput';
import { LoginUserContext, GameContext } from '../../App';
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';
import Modal from 'react-overlays/Modal';

const StyledModal = styled(Modal)`
    position: fixed;
    width: 500px;
    height: 300px;
    z-index: 1100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 11px;
    outline: none;
    background-color: #FDFDFD;
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
export default function StatusContainer(props) {
    const {loginUser} = useContext(LoginUserContext);
    const {game, gameEnableInput, gameDisableInput} = useContext(GameContext);
    const [showStatusInput, setShowStatusInput] = useState(false);

    const renderBackdrop = (props) => <Backdrop {...props} />;

    let localChecklist = {};

    useEffect(() => {
        let timeout = null;
        if (game.current !== null && game.current.game){
          game.current.game.events.on("EVENT_INPUT_STATUS", () => {
            setShowStatusInput(true);
          })
          console.log('server / useEffect() / EVENT_INPUT_STATUS ')
        }
      }, [showStatusInput])

      
    useEffect(() => {
        const disableInput = () => {
          console.log("Game: ", game.current);
          game.current.game.input.keyboard.enabled = false;
          game.current.game.input.mouse.enabled = false;
        } 
        game.current.game.events.on("ready", disableInput);
        return () => {
          game.current.game.events.off("ready", disableInput);
          game.current.game.input.keyboard.enabled = true;
          game.current.game.input.mouse.enabled = true;
        }
    }, []);

    return (
        <div>
            <StyledModal
                show = {showStatusInput}
                onHide = {() => setShowStatusInput(false)}
                renderBackdrop = {renderBackdrop}
            ><StatusInput></StatusInput>
            </StyledModal>
        </div>
    )
}