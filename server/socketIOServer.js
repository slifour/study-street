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
const chance = require("chance").Chance();

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
  let stateUpdateInterval = 300 // interval to update user states
  let logInterval = 100000 // interval to stamp logs
  // let socket // server socket
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList, invitationList, goalList, bookList } = require("./database");
  let interval;

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
    
    socket.on("newArtifact", onNewArtifact.bind(null, socket))
    socket.on("initializeLibrary", onIntializeLibrary.bind(null,socket))

    Object.values(RequestType).forEach( requestType => {
      socket.on(requestType, onRequest.bind(null, socket, requestType));
    });
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