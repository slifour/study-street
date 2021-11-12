import React from 'react';
import styles from './checklist.module.css'
import SingleQuest from './SingleQuest';
import ChecklistFloat from './ChecklistFloat';

// **dummy database** : need to be updated to socket connection
// socket request (1) : my userID
const myUserID = "1a7g6o";

// socket request (2) : whole userList
const userlist = {
    "1a7g6o" : {
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
        "acceptedQuests" : ["eq2dm5"],
        "groups" : ["zoeb3u"], 
        "curGroup" : "zoeb3u"
    },
    "duusdt" : {
        "userID" : "duusdt",
        "userName" : "Jiyoung",
        "status" : "Developing Chat",
        "profile" : undefined,
        "checklist" : {},
        "acceptedQuests" : ["eq2dm5"],
        "groups" : ["zoeb3u"], 
        "curGroup" : "zoeb3u"
    },
    "0mtzta" : {
        "userID" : "0mtzta",
        "userName" : "Jihyeon",
        "status" : "Developing Server",
        "profile" : undefined,
        "checklist" : {},
        "acceptedQuests" : ["eq2dm5"],
        "groups" : ["zoeb3u"], 
        "curGroup" : "zoeb3u"
    },
    "2qjdxq" : {
        "userID" : "2qjdxq",
        "userName" : "Jihoon",
        "status" : "Developing Login System",
        "profile" : undefined,
        "checklist" : {},
        "acceptedQuests" : [],
        "groups" : ["zoeb3u"], 
        "curGroup" : "zoeb3u"
    }
}

//socket request (3) : whole groupList (or only data of current group)
const groupList = {
    "zoeb3u" : {
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
}



export default function ChecklistGroup() {
    const mapQuests = () => {
        let returnComponents = [];
        let doneUsers = [];
        let participatingUsers = [];
        let notYetUsers = [];
        let isAccepted;
        let percentGauge;
        console.log(groupList);
        const quests = groupList[userlist[myUserID].curGroup].quests;
        for (let key in quests) {
            let quest = quests[key];
            quest.doneUsers.forEach(user =>
                doneUsers.push(userlist[user]));
            quest.participatingUsers.forEach(user =>
                participatingUsers.push(userlist[user]))
            quest.notYetUsers.forEach(user =>
                notYetUsers.push(userlist[user]));
    
            if (quest.acceptedUsers.includes(myUserID)){
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