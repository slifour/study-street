
import React, { useState, useContext, useCallback } from 'react';
import styles from './checklist.module.css'
import SingleChecklist from './SingleChecklist';
import uniqueString from 'unique-string';

import { LoginUserContext } from '../../App';
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';

//request: user ID, checklist
//response: user checklist, group quest
export default function ChecklistPersonal() {
    const [isInput, setInput] = useState(false);
    const [inputValue, setInputValue] = useState('Click to write a to-do');
    const {loginUser} = useContext(LoginUserContext);
    const [checklist, setChecklist] = useState({});
    const [quests, setQuests] = useState({});
    const [acceptedQuests, setAcceptedQuests] = useState([]);
    let localChecklist = {};

    //**socket related functions**
    const onResponseOK = useCallback(({payload}) => {
        setChecklist(payload[0]);
        setQuests(payload[1]);
        let tempQuests = {...payload[1]};
        let tempAcceptedQuests = [];
        for (let quest in tempQuests) {
            if (tempQuests[quest].acceptedUsers.includes(loginUser.userID)) {
                tempAcceptedQuests.push(tempQuests[quest].questID);
            }
        }
        setAcceptedQuests(tempAcceptedQuests);

    }, [setQuests, setChecklist, setAcceptedQuests]);

    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to get infomation");
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID,
        updateChecklist: localChecklist
    }), [loginUser.userID, localChecklist]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_PERSONAL_CHECKLIST",
        responseType: "RESPONSE_PERSONAL_CHECKLIST",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    useLiveReload({request, innerReloadTimeRef});


    const mapChecklistsPersonal = () => {
        let returnComponents = [];
        for (let key in checklist) {
            let clist = checklist[key];
            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    <SingleChecklist
                        key={clist.checklistID}
                        checklistID={clist.checklistID}
                        content={clist.content}
                        isDone={clist.isDone}
                        groupParticipation={''}
                    ></SingleChecklist>
                </div>
            )
        }

        return returnComponents.map(el => el)

    }

    const mapChecklistsGroup = () => {
        let returnComponents = [];
        acceptedQuests.forEach(quest => {
            let isDone = false;
            if (quests[quest].doneUsers.includes(loginUser.userID)){
                isDone = true;
            }

            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    <SingleChecklist
                        key={quests[quest].questID}
                        questID={quests[quest].questID}
                        content={quests[quest].type}
                        isDone={isDone}
                        groupParticipation=
                            {`${quests[quest].doneUsers.length}/${quests[quest].acceptedUsers.length} Done`}
                    ></SingleChecklist>
                </div>
            )
        })

        return returnComponents.map(el => el)
    }

    const changeInputValue = (e) => {
        setInputValue(e.target.value);
    }

    const handleInput = () => {
        let updateList = {};
        const checklistKey = uniqueString();
        updateList[checklistKey] = {
            content: inputValue,
            isDone: false
        }
        localChecklist = {...updateList};
        setChecklist((checklist)=> ({...checklist, ...updateList}));
        setInputValue('Click to write a to-do');
        setInput(false);
        request();
    }

    return(
        <div className={styles.personalContainer}>
            { (acceptedQuests !== []) &&
                <div className={styles.groupGoals}>
                    {mapChecklistsGroup()}
                </div>    
            }
            {mapChecklistsPersonal()}
            <div className={styles.checklistBoxContainer}>
                <div className={styles.checklistBox} onClick = {()=>setInput(true)}>
                    <div className={styles.iconsLightGray}>add_circle_outline</div>
                    {!isInput &&
                        <div className={styles.checklistContentInput}>
                            Click to write a to-do
                        </div>
                    }
                    {isInput &&
                        <div className ={styles.inputContainer}>
                            <form className={styles.addChecklistContainer}>
                                <input
                                    type="text"
                                    autoFocus="true"
                                    className={styles.addChecklist}
                                    value={inputValue}
                                    onChange={changeInputValue}
                                ></input>
                            </form>
                            <div className = {styles.addButton} onClick={handleInput}>
                                Add
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}