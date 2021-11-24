
import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import styles from './checklist.module.css'
import styled from 'styled-components';
import SingleChecklist from './SingleChecklist';
import uniqueString from 'unique-string';
import { LoginUserContext, GameContext } from '../../App';
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';
import Modal from 'react-overlays/Modal';
import socket from "../../socket";

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


//request: user ID, checklist
//response: user checklist, group quest
export default function StatusInput(props) {
    const [isInput, setInput] = useState(false);
    const [inputValue, setInputValue] = useState('Click to write a status');
    const {loginUser} = useContext(LoginUserContext);
    const [status, setStatus] = useState({});
    const [quests, setQuests] = useState({});
    const [groupName, setGroupName] = useState('');
    const [acceptedQuests, setAcceptedQuests] = useState([]);
    const {game, gameEnableInput, gameDisableInput} = useContext(GameContext);
    const [showStatusInput, setShowStatusInput] = useState(false);
    let usedRequestKeyRef = useRef(null);

    const renderBackdrop = (props) => <Backdrop {...props} />;

    let localStatus = {};
    let currentState = "";

    useEffect(() => {
        let timeout = null;
        if (game.current !== null && game.current.game){
          game.current.game.events.on("EVENT_INPUT_STATUS", () => {
            setShowStatusInput(true);
          })
          console.log('server / useEffect() / EVENT_INPUT_STATUS ')
        }
      }, [game.current, showStatusInput])   


    //**socket related functions**
    const onResponseOK = useCallback(({payload}) => {
        // setChecklist(payload[0]);

    }, []);

    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to get infomation");
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        status: currentState
    }), [loginUser.userID, currentState]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_STATUS",
        responseType: "RESPONSE_STATUS",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    // useLiveReload({request, innerReloadTimeRef});


    const mapChecklistsPersonal = () => {
        let returnComponents = [];
        for (let key in status) {
            let clist = status[key];
            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    {clist.content} 
                </div>
            )
        }
        return returnComponents.map(el => el)
    }

    const changeInputValue = (e) => {
        setInputValue(e.target.value);
    }

    const handleInput = () => {
        let updateList = {};
        currentState = inputValue;
        const statusKey = uniqueString();
        updateList[statusKey] = {
            content: inputValue
        }
        localStatus = {...updateList};
        setStatus((status)=> ({...status, ...updateList}));
        setInputValue('Click to write a status');
        setInput(false);

        const requestType = "REQUEST_STATUS";
        usedRequestKeyRef.current = uniqueString();

        socket.emit(requestType, {
            requestUser: loginUser.userID,
            requestKey: usedRequestKeyRef.current,
            requestType,
            payload: {
                userID: loginUser.userID,
                status: currentState
            }
        });
        console.log('emited')
    }

    return(

            <div className={styles.personalContainer}>
                <div className={styles.checklistBoxContainer}>
                    <div className={styles.checklistBox} onClick = {()=>setInput(true)}>
                        <div className={styles.iconsLightGray}>add_circle_outline</div>
                        {!isInput &&
                            <div className={styles.checklistContentInput}>
                                Click to write a status
                            </div>
                        }
                        {isInput &&
                            <div className ={styles.inputContainer}>
                                <form className={styles.addChecklistContainer}>
                                    <input
                                        type="text"
                                        autoFocus={true}
                                        className={styles.addChecklist}
                                        value={inputValue}
                                        onChange={changeInputValue}
                                    ></input>
                                </form>
                                <div className = {styles.addButton} onClick={handleInput}>
                                    Set
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {mapChecklistsPersonal()}
            </div>

    )
}