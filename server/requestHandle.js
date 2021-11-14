const chance = require("chance").Chance();
const { RequestType, ResponseType, ResponseStatus } = require("./requestType");
let { userList, groupList, invitationList, goalList, bookList } = require("./database");


module.exports = onRequest = (socket, requestName, request) => {
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

  if (userList[userID]) {
    return socket.emit(responseType, {
      requestKey,
      responseType,
      status: ResponseStatus.OK,
      payload: userList[userID]
    });
  } else {
    return responseFail(socket, requestKey, responseType, "Failed to login.");
  }
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
  try {
    ({groupName} = payload);
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
    colors: payload.colors || defaultColors
  };

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
}