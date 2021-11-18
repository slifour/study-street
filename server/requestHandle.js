const chance = require("chance").Chance();
const { RequestType, ResponseType, ResponseStatus } = require("./requestType");
let { userList, groupList, invitationList, goalList, bookList } = require("./database");
const { updateTodayStudyTime, updateAttendance, createBooks } = require("./databaseHelper");

let env;
let update;

const onRequest = (socket, requestName, request) => {
  console.log("Got request:", request);
  let requestUser, requestKey, requestType, payload;
  try {
    ({requestUser, requestKey, requestType, payload} = request);
    if (requestName !== requestType) throw new Error();
  } catch {
    console.warn("Invalid request: ", request);
    responseFail(socket, request.requestKey || "", ResponseType.OTHER, "Invalid request.");
    return;
  }
  let response;
  switch (requestType) {
    case RequestType.MY_GROUP_LIST: onRequestMyGroupList(socket, request); break;
    case RequestType.INVITE_FRIEND: onRequestInviteFriend(socket, request); break;
    case RequestType.LOGIN: onRequestLogin(socket, request); break;
    case RequestType.MY_PROFILE: onRequestMyProfile(socket, request); break;
    case RequestType.PENDING_INVITE_LIST: onRequestPendingInviteList(socket, request); break;
    case RequestType.CREATE_GROUP: onRequestCreateGroup(socket, request); break;
    case RequestType.JOIN_GROUP: onRequestJoinGroup(socket, request); break;
    case RequestType.TODAY_STUDY_TIME: onRequestTodayStudyTime(socket, request); break;
    case RequestType.UPDATE_TODAY_STUDY_TIME: onRequestUpdateTodayStudyTime(socket, request); break;
    case RequestType.CHANGE_SCENE: onRequestChangeScene(socket, request); break;
    case RequestType.INITIALIZE: onRequestInitialize(socket, request); break;
    case RequestType.CURRENT_GROUP : onRequestCurrentGroup(socket, request); break;
    case RequestType.UPDATE_CURRENT_GROUP : onRequestUpdateCurrentGroup(socket, request); break;
    case RequestType.PERSONAL_CHECKLIST : onRequestPersonalChecklist(socket, request); break;
    case RequestType.TOGGLE_CHECKLIST : onRequestToggleChecklist(socket, request); break;
    case RequestType.ACCEPT_QUEST : onRequestAcceptQuest(socket, request); break;
    case RequestType.NEW_QUEST: onRequestNewQuest(socket, request); break;
    // case RequestType.MOVE: onRequestMove(socket, request); break; 
    default: break;
  }
  socket.emit("response", response);
}

/** 
 * @param {socketIo.Socket} socket
 * @param {string} requestKey 
 * @param {string} responseType
 * @param {object} msg 
*/
 const responseFail = (socket, requestKey, responseType, msg) => {
  socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.FAIL,
    payload: { msg }
  });
};


const onRequestMyGroupList = (socket, request) => {
  const {requestUser, requestKey} = request;
  const responseType = ResponseType.MY_GROUP_LIST;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  };

  let myGroupList = Object.values(groupList)
      .filter(({member}) => member.includes(requestUser));

  return socket.emit(responseType, {
    requestKey, 
    responseType,
    status: ResponseStatus.OK,
    payload: myGroupList
  });
};

const onRequestInviteFriend = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.INVITE_FRIEND;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }
  
  let groupID, friendID;
  try {
    ({groupID, friendID} = payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid request.");
  }
  
  if (groupList[groupID].member.includes(friendID)) {
    return responseFail(socket, requestKey, responseType, "Already in group.");
  }

  if (!userList[friendID]) {
    return responseFail(socket, requestKey, responseType, "Invalid friend id.");
  }
  
  const invitationKey = `${groupID} ${friendID}`;
  invitationList[invitationKey] = {
    groupID,
    friendID,
    hostUser: requestUser,
    inviteTime: new Date()
  };

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });
}

const onRequestLogin = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.LOGIN;

  console.log("onRequestLogin: ", request); 

  let userID;
  try {
    ({userID} = payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid request.");
  }

  if (!userList[userID]) {
    return responseFail(socket, requestKey, responseType, "Failed to login.");
  }

  if (!env.useridList[userID]) {
    let id = socket.id
    env.useridList[userID] = id;
  }

  // login side effects
  try {
    update = updateAttendance(userID);
  } catch {
    console.warn("Failed to update attendance upon login");
  }
  if(update){
    onRequestNewDoneQuest(socket);    
    update = false;
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: userList[userID]
  });
}

const onRequestMyProfile = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.MY_PROFILE;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  /* 기본값은 요청을 보낸 사용자의 프로필을 응답으로 보내는 것.
     그런데 만약 payload.userID가 있으면, 대신 그 유저의 프로필을 응답으로 보냄 */
  if (payload.userID) {
    return socket.emit(responseType, {
      requestKey,
      responseType,
      status: ResponseStatus.OK,
      payload: userList[payload.userID]
    });  
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: userList[requestUser]
  });
}

const onRequestPendingInviteList = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.PENDING_INVITE_LIST;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  /* There are two types of payload.
    1. { userID }
    2. { groupID } */ 

  let filtered;
  if (payload.userID) {
    filtered = Object.values(invitationList).filter( ({friendID}) => payload.userID === friendID );
  } else if (payload.groupID) {
    filtered = Object.values(invitationList).filter( ({groupID}) => payload.groupID === groupID );
  } else {
    return responseFail(socket, requestKey, responseType, "Invalid payload.");
  }
  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: filtered
  });
}

const onRequestCreateGroup = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.CREATE_GROUP;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  let groupName;
  let colors;
  try {
    ({groupName, colors} = payload);
    if (groupName === "") throw new Error();
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid request: Group name is required.");
  }

  const randomIDOption = {
    length: 7,
    alpha: true,
    numeric: true
  };

  let groupID = `group-${chance.string(randomIDOption)}`;
  while (groupList[groupID] !== undefined) {
    groupID = `group-${chance.string(randomIDOption)}`;
  }

  const defaultColors = ['#F79489', '#F9F1F0'];

  groupList[groupID] = {
    groupID,
    groupName,
    leader: requestUser,
    member: [requestUser],
    colors: colors || defaultColors,
    quests: {}
  };

  const sideEffectResponseType = 'RESPONSE_NEW_GROUP'
  
  env.io.emit(sideEffectResponseType, {
    payload : groupList[groupID]
  })

  onRequestNewDoneQuest(socket);

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });
};

const onRequestJoinGroup = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.JOIN_GROUP;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  let groupID;
  try {
    ({groupID} = payload);
    if (groupID === "") throw new Error();
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid request: Group ID is required.");
  }

  const inviteKey = `${groupID} ${requestUser}`;
  if(invitationList[inviteKey] === undefined) {
    return responseFail(socket, requestKey, responseType, "User is not invited to the group. invite key is " + inviteKey + "current invitation list: " + JSON.stringify(invitationList));
  }

  if (!groupList[groupID].member.includes(requestUser)) {
    groupList[groupID].member.push(requestUser);
  }

  delete invitationList[inviteKey];

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });
};

const onRequestInitialize = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.INITIALIZE;

  let prevScene, currentScene;
  try {
    ({prevScene, currentScene} = payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid scene.");
  }
  socket.leave(prevScene);
  socket.join(currentScene);

  switch (currentScene) {
    case "Home": ; break;
    case "Library":  ; break;
    case "Study": ; break;
    case "Rest": ; break;
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });    
};



const onRequestTodayStudyTime = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.TODAY_STUDY_TIME;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  let user;
  if (payload.userID) {
    if (userList[userID]) {
      user = userList[userID];
    } else {
      return responseFail(socket, requestKey, responseType, "User does not exist.");
    }
  } else {
    user = userList[requestUser];
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: user.todayStudyTime || 0
  });
}

const onRequestChangeScene = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.CHANGE_SCENE;

  let prevScene, currentScene;
  try {
    ({prevScene, currentScene} = payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid scene.");
  }

  if (prevScene !== null){
    socket.leave(prevScene);
  }
  socket.join(currentScene);

  let id = socket.id;

  switch (prevScene) {
    case "Home": ; break;
    case "Library": env.libraryRoom.remove(socket); break;
    case "Study": ; break;
    case "Rest": env.restRoom.remove(socket); break;
  }

  switch (currentScene) {
    case "Home": ; break;
    case "Library": onRequestNewDoneQuest(socket); env.roomDict[id] = env.libraryRoom; env.libraryRoom.setUserId(id, requestUser); env.libraryRoom.update(socket, requestUser, 300, 300);  break;
    case "Study": ; break;
    case "Rest": env.roomDict[id] = env.restRoom; env.restRoom.setUserId(id, requestUser); env.restRoom.update(socket, requestUser, 300, 300); break;
  }

  try {
    update = updateAttendance(requestUser);
  } catch {
    return reponseFail(socket, requestKey, responseType, "Failed to update attendance");
  }
  if(update){
    onRequestNewDoneQuest(socket);
    update = false;
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });    
};

const onRequestUpdateTodayStudyTime = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.UPDATE_TODAY_STUDY_TIME;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  let user;
  if (payload.userID) {
    if (userList[userID]) {
      user = userList[userID];
    } else {
      return responseFail(socket, requestKey, responseType, "User does not exist.");
    }
  } else {
    user = userList[requestUser];
  }

  if (!Number.isInteger(payload)) {
    return responseFail(socket, requestKey, responseType, "Invalid payload");
  }

  try {
    update = updateTodayStudyTime(requestUser, payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Failed to update value");
  }
  if(update){
    onRequestNewDoneQuest(socket);
    update = false;
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  });
}

const onRequestCurrentGroup = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.CURRENT_GROUP;

  const curGroupID = userList[payload.userID].curGroup;
  let wrap = [];
  let curGroupInfo = null;
  let curGroupMemberInfo = {}; 
  if (payload.userID) {
    curGroupInfo = groupList[curGroupID];
    for (let user in userList) {
      if (curGroupInfo.member.includes(userList[user].userID)) {
        curGroupMemberInfo[userList[user].userID] = userList[user];
      }
    }
  } else {
    return responseFail(socket, requestKey, responseType, "Invalid payload");
  }

  wrap = [curGroupInfo, curGroupMemberInfo]

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: wrap
  })
}

const onRequestUpdateCurrentGroup = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.UPDATE_CURRENT_GROUP;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  let curGroup;
  try {
    ({curGroup} = payload);
  } catch {
    return responseFail(socket, requestKey, responseType, "Invalid payload.");
  }

  userList[requestUser].curGroup = curGroup;

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}



const onRequestPersonalChecklist = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.PERSONAL_CHECKLIST;

  //handle setter
  if (Object.keys(payload.updateChecklist).length !==0 ) {
    let tempChecklist = {...userList[payload.userID].checklist};
    userList[payload.userID].checklist = {...tempChecklist, ...payload.updateChecklist};
  }

  //handle getter
  let wrap = [];
  wrap[0] = userList[payload.userID].checklist;
  wrap[1] = groupList[userList[payload.userID].curGroup].quests;
  wrap[2] = groupList[userList[payload.userID].curGroup].groupName;

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: wrap
  })
}

const onRequestToggleChecklist = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.TOGGLE_CHECKLIST;
  userList[payload.userID].checklist[payload.checklistID].isDone = payload.isDone;

  console.log(userList[payload.userID].checklist)
  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}

const onRequestAcceptQuest = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.ACCEPT_QUEST;
  const curGroupID = userList[payload.userID].curGroup;

  groupList[curGroupID].quests[payload.questID].acceptedUsers.push(payload.userID);
  groupList[curGroupID].quests[payload.questID].notYetUsers.push(payload.userID);

  // side effects of update accept quest
  try {
    updateAttendance(payload.userID);
  } catch (e) {
    console.warn("Failed to update attendance");
  }

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}

const onRequestNewQuest = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.NEW_QUEST;

  const curGroupID = userList[payload.userID].curGroup;

  //getter
  let wrap = [];
  let isNumOfGoalZero = true;
  let countGoal = 0;
  const quests = groupList[curGroupID].quests;
  let dates = [];

  for (let key in quests) {
      let quest = quests[key];
      if (quest.acceptedUsers.includes(payload.userID) && quest.type === 'Goal'){
        countGoal += 1;
      }
      if (quest.type === 'Attendance') {
        dates.push(quest.contentDate);
      }
  }
  if (countGoal > 0) {
      isNumOfGoalZero = false;
  }

  wrap[0] = isNumOfGoalZero;
  wrap[1] = dates;

  if (payload.quest.contentDate !== 0 && payload.quest.contentDate !== null ){
    groupList[curGroupID].quests[payload.quest.questID] = payload.quest;
  }

  //setter
  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: wrap
  })
}

const onRequestNewDoneQuest = (socket) => {

  const requestKey = null;
  const responseType = "RESPONSE_NEW_DONE_QUEST";
  const books = createBooks();

  //setter
  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: books
  })
}

// const onRequestMove = (socket, request) => {
//   const {requestUser, requestKey, payload} = request;
//   const responseType = ResponseType.CHANGE_SCENE;

//   let position;
//   try {
//     ({position} = payload);
//   } catch {
//     return responseFail(socket, requestKey, responseType, "Invalid scene.");
//   }
//   if (env.roomDict[requestUser] !== undefined){
//     env.roomDict[requestUser].update(socket, requestUser, position.x, position.y);
//   }

//   return socket.emit(responseType, {
//     requestKey,
//     responseType,
//     status: ResponseStatus.OK,
//     payload: {}
//   });    
// };




const initRequestHandle = envParam => {
  env = envParam;
};

module.exports = { onRequest, initRequestHandle };
