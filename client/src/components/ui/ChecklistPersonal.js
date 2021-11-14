import React, { useState } from 'react';
import styles from './checklist.module.css'
import SingleChecklist from './SingleChecklist';

export default function ChecklistPersonal() {
    // **dummy database** : need to be updated to socket connection
    // socket request (1) : my profile
    const myProfile = {
        "userID" : "1a7g6o",
        "userName" : "Jieun",
        "status" : "Developing Checklist",
        "profile" : undefined,
        "checklist" : {
            "8d4jnx" : {
                "content" : "Presentation Preparation",
                "isDone" : false
            },
            "tx3b4e" : {
                "content" : "Reading Response",
                "isDone" : true
            }
        },
        "acceptedQuests" : ["eq2dm5", "nbxm3m"],
        "groups" : ["zoeb3u"], 
        "curGroup" : "zoeb3u"
    }

    // socket request (2) : my current group
    const curGroup = {
        groupID: "zoeb3u",
        groupName: "CS473",
        colors: ['#6FA371', '#EEF3ED'], // [Primary color, Background color]
        members: ["duusdt", "0mtzta", "2qjdxq"],
        quests: {
            "eq2dm5" : {
                type : "Attendance",
                content : "11/14 (Sun) 10:30",
                acceptedUsers : ["duusdt", "0mtzta", "2qjdxq"],
                doneUsers : ["duusdt"],
                participatingUsers : [],
                notYetUsers : ["0mtzta", "2qjdxq"]
            },
            "kwemea" : {
                type : "Attendance",
                content : "11/14 (Sun) 11:30",
                acceptedUsers : ["duusdt"],
                doneUsers : ["duusdt"],
                participatingUsers : [],
                notYetUsers : []
            },
            "nbxm3m" : {
                type : "Goal",
                content : "3 hours",
                acceptedUsers : ["duusdt", "0mtzta", "2qjdxq", "1a7g6o"],
                doneUsers : ["duusdt", "1a7g6o"],
                participatingUsers : [],
                notYetUsers : ["0mtzta", "2qjdxq"]
            }
        }
    }

    const [isInput, setInput] = useState(false);

    const mapChecklistsPersonal = () => {
        let returnComponents = [];
        const checklists = myProfile.checklist;
        for (let key in checklists) {
            let checklist = checklists[key];

            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    <SingleChecklist
                        content={checklist.content}
                        isDone={checklist.isDone}
                        groupParticipation={''}
                    ></SingleChecklist>
                </div>
            )
        }

        return returnComponents.map(el => el)

    }

    const mapChecklistsGroup = () => {
        let returnComponents = [];
        const allQuests = curGroup.quests;

        myProfile.acceptedQuests.forEach(quest => {
            let isDone = false;
            if (allQuests[quest].doneUsers.includes(myProfile.userID)){
                isDone = true;
            }

            returnComponents.push(
                <div className={styles.checklistBoxContainer}>
                    <SingleChecklist
                        content={allQuests[quest].type}
                        isDone={isDone}
                        groupParticipation=
                            {`${allQuests[quest].doneUsers.length}/${allQuests[quest].acceptedUsers.length} Done`}
                    ></SingleChecklist>
                </div>
            )
        })

        return returnComponents.map(el => el)
    }

    return(
        <div className={styles.personalContainer}>
            { (myProfile.acceptedQuests !== []) &&
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
                                <input type="text" className={styles.addChecklist}></input>
                            </form>
                            <div className = {styles.addButton}>
                                Add
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}