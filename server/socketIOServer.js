/**
 * factory function socketIOServer() =>{}
 * server 에서 socket 통신 관련 코드를 작성하면 됩니다.
 * app.js 에서 분리하면 관리하기 편할 것 같다고 생각했는데 별 차이는 없다는 생각이 드네요ㅜㅠ
 * 
 * @ Reference
 * factory function : https://www.geeksforgeeks.org/what-are-factory-functions-in-javascript/
 * factory function vs class : https://urbanbase.github.io/dev/2021/03/28/ECMAScript6.html
 */

const socketIo = require("socket.io");
const { RequestType, ResponseType, ResponseStatus } = require("./requestType");
const { onRequest, initRequestHandle } = require("./requestHandle")
const chance = require("chance").Chance();
const Rooms = require("./room.js")
let { userList, groupList, invitationList, goalList, bookList } = require("./database");

const SocketIOServer = () => {
  /**
   * @example 
   * let <variableName>;
   * const <functionName> = (<argument>) => {
   *    <functionBody>
   * }
   * 
   * return {
   *    <variable to excess from outssocket.ide>,
   *    <function to excess from outssocket.ide>
   * }
   */

  /** Variables */
  /** 
   * @type {Object.<string, {
   *  flipX: boolean,
   *  x: number,
   *  y: number,
   *  userId: string,
   *  scene: string
   * }>}
   */
  const users = {}; // users data structure


  let stateChanged = false // flag whether state is changed = for transmission efficientcy
  let isEmittingUpdates = false // flag whether server is emitting updates = to prevent redundant emission and coliision
  let stateUpdateInterval = 100 // interval to update user states
  let logInterval = 10000 // interval to stamp logs
  // let socket // server socket
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList, invitationList, goalList, bookList } = require("./database");
  let interval;
  let addedUser = false

  // MUST: env = 1; <- 이런 식으로 env에 다른 값을 직접 대입하시면 안 돼요! 
  // env.libraryRoom = ... <- 이런 식으로 써 주세요~
  let env = {
    libraryRoom: new Rooms('Library'),
    restRoom: new Rooms('Rest'),
    roomDict: {}
  };

  /** Methods */
  /** Initialize */  
  const init = (server) => {
    io = socketIo(server, {
      cors: {
        // origin: origin,
        origin: true, // Allow any origin
        methods: ["GET", "POST"]
      }
    });

    env.io = io;
    initRequestHandle(env);

    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.emit("socket.id", socket.id);      
      console.log(socket.id);
      setEventHandlers(socket);      
      logUsers()
    });
  }

  /** Event Handlers */
  const setEventHandlers = (socket) => {
    env.libraryRoom.init(io, socket);
    env.restRoom.init(io, socket);

    /** socket.on('event', eventHandler.bind(null, socket)) */
    socket.on("disconnect", onDisconnect.bind(null, socket))
    socket.on("REQUEST_MOVE", onRequestMove.bind(null, socket))  
    /* socket.on("createGroup", onCreateGroup(null, socket)) */
    socket.on("joinGroup", onJoinGroup.bind(null, socket))
    socket.on("leaveGroup", onLeaveGroup.bind(null, socket))
    //socket.on("sendGroupMessage", onSendGroupMessage.bind(null, socket))
    socket.on("add user", onJoinChat.bind(null, socket))
    socket.on("chatdisconnect", onLeaveChat.bind(null, socket))
    socket.on("chat message", onSendPrivateMessage.bind(null, socket))
    socket.on("sceneUpdate", onSceneUpdate.bind(null, socket))  
    // socket.on("initialize", onInitialize.bind(null, socket))  
    socket.on("userLoginRequest", onUserLoginRequest.bind(null, socket))
    socket.on("userProfileRequest", onUserProfileRequest.bind(null, socket))    
    socket.on("newArtifact", onNewArtifact.bind(null, socket))
    socket.on("initializeLibrary", onIntializeLibrary.bind(null,socket))
    socket.on("REQUEST_CURRENT_GROUP", onRequestCurrentGroup.bind(null, socket))
    socket.on("REQUEST_PERSONAL_CHECKLIST", onRequestPersonalChecklist.bind(null, socket))
    socket.on("REQUEST_TOGGLE_CHECKLIST", onRequestToggleChecklist.bind(null, socket))
    socket.on("REQUEST_ACCEPT_QUEST", onRequestAcceptQuest.bind(null, socket))

    Object.values(RequestType).forEach( requestType => {
      socket.on(requestType, onRequest.bind(null, socket, requestType));      
    });
    updateDate(socket);    

  }

  const onRequest = (socket, requestName, request) => {
    console.log("Hi");
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
    console.log('request :', request);
    switch (requestType) {
      case RequestType.MY_GROUP_LIST: onRequestMyGroupList(socket, request); break;
      case RequestType.INVITE_FRIEND: onRequestInviteFriend(socket, request); break;
      case RequestType.LOGIN: onRequestLogin(socket, request); break;
      case RequestType.MY_PROFILE: onRequestMyProfile(socket, request); break;
      case RequestType.PENDING_INVITE_LIST: onRequestPendingInviteList(socket, request); break;
      case RequestType.CREATE_GROUP: onRequestCreateGroup(socket, request); break;
      case RequestType.JOIN_GROUP: onRequestJoinGroup(socket, request); break;
      case RequestType.CHANGE_SCENE: onRequestChangeScene(socket, request); break;
      case RequestType.INITIALIZE: onRequestInitialize(socket, request); break;
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
      colors: colors || defaultColors
    };

    const sideEffectResponseType = 'RESPONSE_NEW_GROUP'
    
    io.emit(sideEffectResponseType, {
      payload : groupList[groupID]
    })

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

    let id = socket.id;

    if (prevScene !== null){
      socket.leave(prevScene);
    }
    socket.join(currentScene);

    switch (prevScene) {
      case "Home": ; break;
      case "Library": libraryRoom.remove(socket); break;
      case "Study": ; break;
      case "Rest": restRoom.remove(socket); break;
    }

    switch (currentScene) {
      case "Home": ; break;
      case "Library": roomDict[id] = libraryRoom; libraryRoom.update(socket, 300, 300);  break;
      case "Study": ; break;
      case "Rest": roomDict[id] = restRoom; restRoom.update(socket, 300, 300); break;
    }

    return socket.emit(responseType, {
      requestKey,
      responseType,
      status: ResponseStatus.OK,
      payload: {}
    });    
  };

  /* 아직 오류 있음 */
  const onJoinGroup = (socket, groupID, userID) => {
    socket.join(groupList[groupID]);
    memList = groupList[groupID].member;
    memList.append(userID);
      /*, () => {
      console.log(userID + ' join a ' + room[groupID]);
      io.to(room[groupID]).emit("joinGroup", groupID, userID);
    });*/
  }

    /* 아직 오류 있음 */
  const onLeaveGroup = (socket, groupID, userID) => {
    socket.leave(groupList[groupID]);
    memList = groupList[groupID].member;
    memList.remove(userID);
      /*, () => {
      console.log(userID + ' leave a ' + room[groupID]);
      io.to(room[groupID]).emit("leaveGroup", groupID, userID);
    });*/
  }
  
  /* 아직 오류 있음 */
  /*const onSendGroupMessage = (socket, groupID, userID, msg) => {
    a = groupID;
    console.log('${userID} : ${msg}');
    socket.to(groupList[a].member).emit('group chat message', {
      username: userID,
      message: msg
    });
  }*/

  /* 아직 오류 있음 */
  const onJoinChat = (socket, userID) => {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    console.log("connected : "+userID);
    addedUser = true;
    socket.emit('chatconnect');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: userID
    });
  }

  const onLeaveChat = (socket, userID) => {
      if (addedUser) {
        console.log("disconnected : "+userID);
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: userID
        });
      }
  }

  /* 아직 오류 있음 */
  const onSendPrivateMessage = (socket, senduserID, msg) => {
    console.log('${senduserID} : ${msg}');
    socket.broadcast.emit('chat message', { //to(userList[user1ID])
      username: senduserID,
      message: msg
    });
  }

  const onNewArtifact = (socket) => {
    console.log('server : newArtifact')
    data = {
      goal : 'Study everyday',
      group : 'Slifour'
    }
    socket.emit("newArtifact", data)
  }

  /* Home scene */
  const onUserLoginRequest = (socket, userID) => {
    if (!userList[userID]) {
      socket.emit("userLoginFail");
    } else {
      socket.emit("userLoginOK", userList[userID]);
    }
  }
  
  const onUserProfileRequest = (socket, userID) => {
    socket.emit("userProfile", userList[userID]);
  }  
  
  const onPositionUpdate = (socket, positionData) => {
    if (!Object.keys(users).includes(socket.id)){
      return
    }
    stateChanged = true;
    let user = users[socket.id];
    user.position = positionData;
  }
  
  const onRequestMove = (socket, position) => {
    let id = socket.id;
    if (env.roomDict[id]) {
      env.roomDict[id].update(socket, position.x, position.y);
    }
  }

  const onSceneUpdate = (socket, scene) => {
    console.log('Client moved to {} scene'.format(scene))
    stateChanged = true;
    let user = users[socket.id];
    user.scene = scenes[newScene]
    socket.join(newScene);    
    socket.leave(prevScene);
  }
  
  const onIntializeLibrary = (socket) =>{
    socket.emit("goalUpdate", bookList);
  }

  const onInitialize = (socket, data) => {
    let scene = data.scene
    console.log("New user initialized");
    stateChanged = true;    
    
    let newUser = createUser(socket.id, data.name, data.group, data.position, data.scene); // Create a new user object
    users[socket.id] = newUser;  // Add the newly created user to game state.
    socket.broadcast.emit("initialize", socket.id, data.name, data.group, data.position)
  
    if (numUsers() === 1 && !isEmittingUpdates) { //On first user joined, start update emit loop
      emitStateUpdateLoop(socket, 'room');
    }
  }

  /** Helpers */

  /** 
   * Loop that emits real-time data 
   * - positions {socket.id : {x:x, y:y}}
  */
  
  const emitUpdateLoop = (socket, room) => {
    isEmittingUpdates = true;
    // Reduce usage by only send state update if state has changed
    if (stateChanged) {
      stateChanged = false;
      socket.to(room).emit("stateUpdate", users);
      console.log("stateUpdate")
    }
    
    if (numUsers() > 0) {
      setTimeout(emitStateUpdate.bind(this), stateUpdateInterval);
    } else {
      isEmittingUpdates = false;
    }
  }

  /** 
   * Loop that emits real-time data 
   * - positions {socket.id : {x:x, y:y}}
  */
  // const emitStateUpdateLoop = (socket, room) => {
  //   isEmittingUpdates = true;
  //   // Reduce usage by only send state update if state has changed
  //   if (stateChanged) {
  //     stateChanged = false;
  //     socket.emit("stateUpdate", users);
  //     console.log("stateUpdate")
  //   }
    
  //   if (numUsers() > 0) {
  //     setTimeout(emitStateUpdateLoop.bind(this), stateUpdateInterval);
  //   } else {
  //     isEmittingUpdates = false;
  //   }
  // }

  const numUsers = () =>  {
    return Object.keys(users).length;
  }
  
  const createUser = (id, name, group, position) => {
    return({id,
      name,
      group,
      position
    })
  }

  /** log */  
  let logUsers = () =>  {
    console.log("libraryRoom.numUsers :", env.libraryRoom.getNumUsers());
    setTimeout(logUsers.bind(this), logInterval);
  }   

  const updateDate = (socket) => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
  }

  const getApiAndEmit = (socket) => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
  };

  const onDisconnect = (socket) => {
    console.log("Client disconnected");    
    // Remove user from state on disconnect
    env.libraryRoom.remove(socket);
    env.restRoom.remove(socket);
    clearInterval(interval);
    stateChanged = true;
  }
    
  return {
    /** Variables */
    stateChanged, // flag whether state is changed : for transmission efficientcy
    isEmittingUpdates, // flag whether server is emitting updates : to prevent redundant emission and coliision
    stateUpdateInterval, // interval to update user states
    logInterval, // interval to stamp logs
    users, // users data structure
    scenes : {'FirstScene' : 1, 'SecondScene' : 2}, // scenes

    /** Methods */
    init 
  }
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

  if (payload.checklistID != null) {
    console.log(true);
    userList[payload.userID].checklist[payload.checklistID].isDone = payload.isDone;
  }

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

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}

module.exports = SocketIOServer