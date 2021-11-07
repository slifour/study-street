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
const { RequestType, ResponseType } = require("./requestType");

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
  let logInterval = 10000 // interval to stamp logs
  // let socket // server socket
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList } = require("./database");
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
      console.log(socket.id)
      setEventHandlers(socket)      
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
    // socket.on("userParticipatedGroupRequest", onUserParticipatedGroupRequest.bind(null, socket))
    socket.on("request", onRequest.bind(null, socket));
    updateDate(socket)
  }

  const onRequest = (socket, request) => {
    console.log("Got request:", request);
    let requestUser, type, payload;
    try {
      ({requestUser, type, payload} = request);
    } catch {
      console.warn("Invalid request: ", request);
      socket.emit("response", {
          requestUser,
          type: ResponseType.FAIL,
          payload: {
            "msg": "Invalid request."
          }
      });  
      return;
    }
    let response;
    switch (type) {
      case RequestType.MY_GROUP_LIST: response = onRequestMyGroupList(socket, request); break;
    }
    socket.emit("response", response);
  }

  const onRequestMyGroupList = (socket, request) => {
    const {requestUser, type, payload} = request;

    if (!requestUser) {
      return {
        requestUser,
        type: ResponseType.FAIL,
        payload: {
          "msg": "Login is required."
        }
      }
    };

    let myGroupList = Object.values(groupList)
        .filter(({member}) => member.includes(requestUser));
    return {
      requestUser,
      type: ResponseType.MY_GROUP_LIST,
      payload: myGroupList
    };
  };

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

  /* 아직 오류 있음 */
  // const onUserParticipatedGroupRequest = (socket, userID)=> {
  //   let response = [];
  //   Object.entries(groupList).forEach(([key, value]) => {
  //     if (value.member[userID] !== undefined) {
  //       response.append(value);
  //     }
  //   });
  //   socket.emit("userParticipatedGroup", response);
  // }  

  
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
  
  const onInitialize = (socket, data) => {
    console.log("New user initialized");
    stateChanged = true;    
  
    // Create a new user object
    let newUser = createUser(socket.id, data.name, data.group, data.position, data.scene);

    // Add the newly created user to game state.
    users[socket.id] = newUser;
  
    socket.broadcast.emit("initialize", socket.id, data.name, data.group, data.position)
  
    //On first user joined, start update emit loop
    if (numUsers() === 1 && !isEmittingUpdates) {
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
  const logUsers = () =>  {
    console.log(users);
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