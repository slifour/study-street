import React, { useCallback, useContext, useState } from 'react';
import styles from './checklist.module.css'
import SingleQuest from './SingleQuest';
import ChecklistFloat from './ChecklistFloat';

import { LoginUserContext } from '../../App';
import useLiveReload from '../request/useLiveReload';
import useRequest from '../request/useRequest';

export default function ChecklistGroup() {
    const {loginUser} = useContext(LoginUserContext);
    const [groupInfo, setGroupInfo] = useState({});
    const [membersInfo, setMembersInfo] = useState({});

    //**socket related functions**
    const onResponseOK = useCallback(({payload}) => {
        setGroupInfo(payload[0]);
        setMembersInfo(payload[1]);
    }, [setGroupInfo, setMembersInfo]);

    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to get group information");
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID
    }), [loginUser.userID]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_CURRENT_GROUP",
        responseType: "RESPONSE_CURRENT_GROUP",
        onResponseOK,
        onResponseFail,
        makePayload
    });

    useLiveReload({request, innerReloadTimeRef});


    const mapQuests = () => {
        //console msg
        console.log(loginUser.userID);
        console.log(groupInfo);
        console.log(membersInfo);
        let returnComponents = [];
        let doneUsers = [];
        let participatingUsers = [];
        let notYetUsers = [];
        let isAccepted;
        let percentGauge;
        const quests = groupInfo.quests;
        for (let key in quests) {
            let quest = quests[key];
            quest.doneUsers.forEach(user =>
                doneUsers.push(membersInfo[user]));
            quest.participatingUsers.forEach(user =>
                participatingUsers.push(membersInfo[user]))
            quest.notYetUsers.forEach(user =>
                notYetUsers.push(membersInfo[user]));
    
            if (quest.acceptedUsers.includes(loginUser.userID)){
                isAccepted = true;
            }
    
            percentGauge =
                Math.round(quest.doneUsers.length * 100 /quest.acceptedUsers.length);
    
                returnComponents.push(<SingleQuest
                    type = {quest.type}
                    content = {quest.content}
                    isAccepted = {isAccepted}
                    doneUsers = {JSON.parse(JSON.stringify(doneUsers))}
                    participatingUsers = {JSON.parse(JSON.stringify(participatingUsers))}
                    notYetUsers = {JSON.parse(JSON.stringify(notYetUsers))}
                    percentGauge = {percentGauge}
                    key = {quest.questID}
                ></SingleQuest>)
            
            doneUsers = [];
            participatingUsers = [];
            notYetUsers = [];
            isAccepted = false;
        }
    
        return returnComponents.map(el => el)
    }

    return(
        <div>
            <div className={styles.groupGoalsContainer}>
                {mapQuests()}
                <div className={styles.heightCompensation}></div>
            </div>
            <ChecklistFloat></ChecklistFloat>
        </div>
    )
}