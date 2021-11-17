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
    socket.on("REQUEST_NEW_QUEST", onRequestNewQuest.bind(null, socket))

    Object.values(RequestType).forEach( requestType => {
      socket.on(requestType, onRequest.bind(null, socket, requestType));      
    });
    updateDate(socket);    

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
    // console.log("libraryRoom.numUsers :", env.libraryRoom.getNumUsers());
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

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}

const onRequestNewQuest = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.ACCEPT_QUEST;

  const curGroupID = userList[payload.userID].curGroup;
  groupList[curGroupID].quests[payload.quest.questID] = payload.quest;

  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: {}
  })
}

module.exports = SocketIOServer