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
   *    <function to excess frc om outssocket.ide>
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
  //const useridList = {}; // dictionary with key: user ID, value: user socket ID


  let stateChanged = false // flag whether state is changed = for transmission efficientcy
  let isEmittingUpdates = false // flag whether server is emitting updates = to prevent redundant emission and coliision
  let stateUpdateInterval = 100 // interval to update user states
  let logInterval = 10000 // interval to stamp logs
  // let socket // server socket
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList, invitationList, goalList, bookList } = require("./database");
  let interval;
  //let addedUser = env.useridList.map(false

  // MUST: env = 1; <- 이런 식으로 env에 다른 값을 직접 대입하시면 안 돼요! 
  // env.libraryRoom = ... <- 이런 식으로 써 주세요~
  let env = {
    libraryRoom: new Rooms('Library'),
    restRoom: new Rooms('Rest'),
    socketIDToRoom: {},
    useridList: {},
    addedUser: {}
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
      // console.log("New client connected");
      onRequestConnect(socket);     
      // console.log(socket.id);
      env.libraryRoom.init(io, socket);
      env.restRoom.init(io, socket);
      setEventHandlers(socket);      
      logUsers()
    });
  }

  const onRequestConnect = (socket) => {
    requestKey = null;
    const responseType = ResponseType.CONNECT;

    const payload = {socketID : socket.id}
  
    return socket.emit(responseType, {
      requestKey, 
      responseType,
      status: ResponseStatus.OK,
      payload: payload
    });
  };

  /** Event Handlers */
  const setEventHandlers = (socket) => {

    /** socket.on('event', eventHandler.bind(null, socket)) */
    socket.on("disconnect", onDisconnect.bind(null, socket))
    socket.on("REQUEST_MOVE", onRequestMove.bind(null, socket))  
    /* socket.on("createGroup", onCreateGroup(null, socket)) */
    socket.on("joinGroup", onJoinGroup.bind(null, socket))
    socket.on("leaveGroup", onLeaveGroup.bind(null, socket))
    //socket.on("sendGroupMessage", onSendGroupMessage.bind(null, socket))
    socket.on("call chat log", onCallChatLog.bind(null, socket))
    socket.on("add user", onJoinChat.bind(null, socket))
    socket.on("chatdisconnect", onLeaveChat.bind(null, socket))
    socket.on("chat message", onSendPrivateMessage.bind(null, socket))
    // socket.on("REQUEST_MOVE", onRequestMove.bind(null, socket))  
    
    socket.on("sceneUpdate", onSceneUpdate.bind(null, socket))  
    // socket.on("initialize", onInitialize.bind(null, socket))  
    socket.on("userLoginRequest", onUserLoginRequest.bind(null, socket))
    socket.on("userProfileRequest", onUserProfileRequest.bind(null, socket))    
    socket.on("newArtifact", onNewArtifact.bind(null, socket))
    socket.on("initializeLibrary", onIntializeLibrary.bind(null,socket))

    Object.values(RequestType).forEach( requestType => {
      socket.on(requestType, onRequest.bind(null, socket, requestType));      
    });
    updateDate(socket);    
  }

  const onRequestMove = (socket, position) => {
    let socketID = socket.id
    if (env.socketIDToRoom[socketID] !== undefined){
      env.socketIDToRoom[socketID].update(socket, position.x, position.y);
    }
  }

  let isChangedGroupList = true;
  const emitLoop = (stateChanged) => {
    isEmittingUpdates = true;        
    if (stateChanged) {
        stateChanged = false;
        broadcast("LOOP_POSITION", positionList);
        // console.log("LOOP_POSITION", room)
    }        
    if (getNumUsers() > 1) {
        setTimeout(emitLoop.bind(this), updateInterval);
    } 
    else {
        isEmittingUpdates = false;
    }
  }

  const setLoops = () => {
    
  }

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
  const onJoinChat = (socket, userID) => {
    if (env.addedUser[userID]) return;
    // we store the username in the socket session for this client
    //socket.username = username;
    console.log("connected : "+userID);
    env.addedUser[userID] = true;
    socket.emit('chatconnect');
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: userID
    });

  }

  const onLeaveChat = (socket, userID) => {
      if (env.addedUser[userID]) {
        // console.log("disconnected : "+userID);
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: userID
        });
      }
      env.addedUser[userID] = false;
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
  const onCallChatLog = (socket, chatLog) => {
    // console.log('loading chat message...');
    socket.to().emit('load chat log', {chatlog: chatLog});
  }

  /* 아직 오류 있음 */
  const onSendPrivateMessage = (socket, senduserID, receiveuserID, msg) => {
    /*if (!userList[receiveuserID]) {
      socket.emit("chatSendFail");
    } else {
      receiveID = useridList[receiveuserID];
      console.log(`${senduserID} : ${msg}`);
      socket.to(receiveID).emit('chat message', { //userID? to(receiveuserID)
        sendname: senduserID,
        receivename: receiveID,
        message: msg
      });
    }*/
    // console.log("useridlist: ", env.useridList);
    for(let user in env.useridList){
      if(user === receiveuserID){
        console.log(`${senduserID} : ${msg}`);
        socket.to(env.useridList[user]).emit('chat message', { //userID? to(receiveuserID)
          sendname: senduserID,
          //receivename: receive,
          message: msg
        });
      }
    }
  }

  const onNewArtifact = (socket) => {
    // console.log('server : newArtifact')
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
      /*if (!useridList[userID]) {
        let id = socket.id
        useridList[userID] = id;
      }*/
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
  
  // const onRequestMove = (socket, id, position) => {
  //   if (socketIDToRoom[id] !== undefined){
  //     socketIDToRoom[id].update(socket, position.x, position.y);
  //   }
  // }

  const onSceneUpdate = (socket, scene) => {
    // console.log('Client moved to {} scene'.format(scene))
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
    // console.log("New user initialized");
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
      // console.log("stateUpdate")
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
    let userID = env.useridList[socket.id]
    console.log("Client disconnected");    
    // Remove user from state on disconnect
    env.libraryRoom.stand(socket, userID);
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
 
module.exports = SocketIOServer