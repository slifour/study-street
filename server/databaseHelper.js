const { userList, groupList, invitationList, goalList, bookList } = require("./database");

/** @returns {bool} possibility to check quest done */
const helperCheckQuestDone = (quest, todayStudyTime) => {
  const ATTENDANCE_TIME_DIFFERENCE = 30 * 60 * 1000; // 약속 시간 전후 30분 이내에 들어오면 출석으로 인정
  switch (quest.type) {
    case "Attendance": 
      const currentTime = new Date();
      if (Math.abs(currentTime - quest.contentDate) <= ATTENDANCE_TIME_DIFFERENCE)
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
    const group = groupList[user.curGroup]; // Note: curGroup이 데이터베이스에 있는 게 맞나?
    const checkableQuestList = Object.values(group.quests)
      .filter(({notYetUsers}) => (notYetUsers.includes(userID))) // Not yet users
      .filter( quest => (helperCheckQuestDone(quest, todayStudyTime)));
    checkableQuestList.forEach(quest => {
      quest.notYetUsers = quest.notYetUsers.filter(notYetUserID => (notYetUserID !== userID));
      quest.doneUsers.push(userID);
    });
    
    // TODO: participateQuestList의 각각을 user의 todayStudyTime과 비교.
  } catch (e) {
    user.todayStudyTime = oldTodayStudyTime; // rollback
    console.error(e);
    throw e;
  }
}

module.exports = { updateTodayStudyTime };