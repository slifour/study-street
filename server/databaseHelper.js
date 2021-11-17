const { userList, groupList, invitationList, goalList, bookList } = require("./database");

/** @returns {bool} possibility to check quest done */
const helperCheckQuestDone = (quest, todayStudyTime) => {
  switch (quest.type) {
    case "Attendance": 
      const currentTime = new Date();
      if (currentTime.toDateString() === quest.contentDate.toDateString())
        return true;
      break;
    case "Goal":
      if (todayStudyTime >= quest.contentDate) 
        return true;
      break;
  }
  return false;
}

const updateTodayStudyTime = (userID, todayStudyTime) => {
  const user = userList[userID]; // Note: 에러 처리를 여기서도 해야 하나?
  const oldTodayStudyTime = user.todayStudyTime;

  try { // rollback을 위한 try 구문
    user.todayStudyTime = todayStudyTime;

    // Side effects
    const group = groupList[user.curGroup]; // Note: curGroup이 데이터베이스에 있는 게 맞나?
    const checkableQuestList = Object.values(group.quests)
      .filter(({notYetUsers}) => (notYetUsers.includes(userID))) // Not yet users
      .filter( quest => (quest.type === "Goal")) // Check only goals (not attendances) to be done 
      .filter( quest => (helperCheckQuestDone(quest, todayStudyTime)));
    checkableQuestList.forEach(quest => {
      quest.notYetUsers = quest.notYetUsers.filter(notYetUserID => (notYetUserID !== userID));
      quest.doneUsers.push(userID);
    });
  } catch (e) {
    user.todayStudyTime = oldTodayStudyTime; // rollback
    console.error(e);
    throw e;
  }
}

const updateAttendance = userID => {
  const user = userList[userID];
  const group = groupList[user.curGroup];
  const checkableAttendance = Object.values(group.quests)
    .filter(quest => quest.notYetUsers.includes(userID))
    .filter(quest => quest.type === "Attendance")
    .find( attendance => helperCheckQuestDone(attendance, null));
  // console.log("Update attendance: ", checkableAttendance);
  if (checkableAttendance) {
    const questID = checkableAttendance.questID;
    const oldAttendance = checkableAttendance;
    // Transaction
    try {
      checkableAttendance.notYetUsers = checkableAttendance.notYetUsers.filter(notYetUserID => notYetUserID !== userID);
      checkableAttendance.doneUsers.push(userID);
    } catch (e) { // Rollback
      group.quests[questID] = oldAttendance;
      console.error(e);
      throw e;
    }
  }
}

module.exports = { updateTodayStudyTime, updateAttendance };