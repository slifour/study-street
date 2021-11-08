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

  /** 
   * @type {Object.<string, {
   *  flipX: boolean,
   *  groupId: string,
   *  status: string,
   *  memberList: string[]
   * }>}
   */
  const groups = {}; // group data structure

  let stateChanged = false // flag whether state is changed = for transmission efficientcy
  let isEmittingUpdates = false // flag whether server is emitting updates = to prevent redundant emission and coliision
  let stateUpdateInterval = 300 // interval to update user states
  let logInterval = 100000 // interval to stamp logs
  // let socket // server socket
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList, invitationList, goalList, bookList } = require("./database");
  let interval;

  /** Methods */
  /** Initialize */  
  const init = (server, origin) => {
    io = socketIo(server, {
      cors: {
        origin: origin,
        methods: ["GET", "POST"]
      }
    }); // < Interesting!

    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.emit("socket.id", socket.id);      
      console.log(socket.id);
      setEventHandlers(socket);      
      logUsers()
    });
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
    stateChanged = true;
    delete users[socket.id];
    clearInterval(interval);
  }
  
  /** Event Handlers */
  const setEventHandlers = (socket) => {
    /** socket.on('event', eventHandler.bind(null, socket)) */
    socket.on("disconnect", onDisconnect.bind(null, socket))
    socket.on("positionUpdate", onPositionUpdate.bind(null, socket))  
    socket.on("sceneUpdate", onSceneUpdate.bind(null, socket))  
    socket.on("initialize", onInitialize.bind(null, socket))  
    socket.on("userLoginRequest", onUserLoginRequest.bind(null, socket))
    socket.on("userProfileRequest", onUserProfileRequest.bind(null, socket))
    /*socket.on("userParticipatedGroupRequest", onUserParticipatedGroupRequest.bind(null, socket))*/
    socket.on("joinTextChat", onJoinGroup.bind(null, socket))
    socket.on("leaveTextChat", onLeaveGroup.bind(null, socket))
    socket.on("sendGroupMessage", onSendGroupMessage.bind(null, socket))
    socket.on("sendPrivateMessage", onSendPrivateMessage.bind(null, socket))
    socket.on("updateGroupStatus", onUpdateGroupStatus.bind(null, socket))
    socket.on("newArtifact", onNewArtifact.bind(null, socket))
    socket.on("initializeLibrary", onIntializeLibrary.bind(null,socket))
    socket.on(RequestType.MY_GROUP_LIST, onRequest.bind(null, socket, RequestType.MY_GROUP_LIST));
    socket.on(RequestType.INVITE_FRIEND, onRequest.bind(null, socket, RequestType.INVITE_FRIEND));
    socket.on(RequestType.LOGIN, onRequest.bind(null, socket, RequestType.LOGIN));
    socket.on(RequestType.MY_PROFILE, onRequest.bind(null, socket, RequestType.MY_PROFILE));
    updateDate(socket)
  }

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
    
    const invitationKey = `${groupID} ${friendID}`;
    invitationList[invitationKey] = {
      groupID,
      friendID,
      inviteTime: new Date()
    };

    return socket.emit(responseType, {
      requestUser,
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

  const onRequestMyProfile = (socket, userID) => {
    const {requestUser, requestKey, payload} = request;
    const responseType = ResponseType.MY_PROFILE;

    if (!requestUser) {
      return responseFail(socket, requestKey, responseType, "Login is required.");
    }

    return socket.emit(responseType, {
      requestKey,
      responseType,
      status: ResponseStatus.OK,
      payload: userList[userID]
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

  /* 아직 오류 있음; 추가적인 구조 수정 필요 */
  /*const onUserParticipatedGroupRequest = (socket, userID) => {
    let response = [];
    Object.entries(groupList).forEach(([key, value]) => {
      if (value.member[userID] !== undefined) {
        response.append(value);
      }
    });
    socket.emit("userParticipatedGroup", response);
  }*/

  /* 아직 오류 있음 */
  const onJoinGroup = (socket, groupID, userID) => {
    socket.join(groups[groupID]);
    memList = groups.memberList;
    memList.append(userID);
      /*, () => {
      console.log(userID + ' join a ' + room[groupID]);
      io.to(room[groupID]).emit("joinGroup", groupID, userID);
    });*/
  }

    /* 아직 오류 있음 */
  const onLeaveGroup = (socket, groupID, userID) => {
    socket.leave(groups[groupID]);
    memList = groups.memberList;
    memList.remove(userID);
      /*, () => {
      console.log(userID + ' leave a ' + room[groupID]);
      io.to(room[groupID]).emit("leaveGroup", groupID, userID);
    });*/
  }
  
  /* 아직 오류 있음 */
  const onSendGroupMessage = (socket, groupID, userID, msg) => {
    a = groupID;
    io.to(groups[a]).emit('chat message', userID, msg);
  }

  /* 아직 오류 있음 */
  const onSendPrivateMessage = (socket, user1ID, user2ID, msg) => {
    io.to(users[user1ID]).emit('chat message', user2ID, msg);
  }

  /* 아직 오류 있음 */
  const onUpdateGroupStatus = (socket, groupID, stat) => {
    if (!groupList[groupID]) {S
      socket.emit("findingGroupFail");
    } else {
      let group = groupList[groupID];
      group.status = stat;
    }
  }

  const onPositionUpdate = (socket, positionData) => {
    if (!Object.keys(users).includes(socket.id)){
      return
    }
    stateChanged = true;
    let user = users[socket.id];
    user.position = positionData;
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
    console.log("New user initialized");
    stateChanged = true;    
    let newUser = createUser(socket.id, data.name, data.group, data.position, data.scene); // Create a new user object
    users[socket.id] = newUser;  // Add the newly created user to game state.
    socket.broadcast.emit("initialize", socket.id, data.name, data.group, data.position)
  
    if (numUsers() === 1 && !isEmittingUpdates) { //On first user joined, start update emit loop
      emitStateUpdateLoop('room');
    }
  }

  /** Helpers */

  /** 
   * Loop that emits real-time data 
   * - positions {socket.id : {x:x, y:y}}
  */
  const emitStateUpdateLoop = (socket, room) => {
    isEmittingUpdates = true;
    // Reduce usage by only send state update if state has changed
    if (stateChanged) {
      stateChanged = false;
      io.emit("stateUpdate", users);
      console.log("stateUpdate")
    }
    
    if (numUsers() > 0) {
      setTimeout(emitStateUpdateLoop.bind(this), stateUpdateInterval);
    } else {
      // Stop the setTimeout loop if there are no users left
      isEmittingUpdates = false;
    }
  }

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
    // console.log(users);
    setTimeout(logUsers.bind(this), logInterval);
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

module.exports = SocketIOServer