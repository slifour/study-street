/**
 * class socketIOServer
 * 
 * @ Reference
 * factory function : https://www.geeksforgeeks.org/what-are-factory-functions-in-javascript/
 * factory function vs class : https://urbanbase.github.io/dev/2021/03/28/ECMAScript6.html
 */

const socketIo = require("socket.io");

const SocketIOServer = () => {
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
  let logInterval = 5000 // interval to stamp logs
  let socket // server socket
  let id // socket id
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io
  let { userList, groupList } = require("./database");

  /** Methods */
  /** Initialize */  
  let init = (server, origin) => {
    io = socketIo(server, {
      cors: {
        origin: origin,
        methods: ["GET", "POST"]
      }
    }); // < Interesting!

    io.on("connection", (socketConnected) => {
      console.log("New client connected");
      socket = socketConnected 
      id = socket.id
      socket.emit("id", id);
      setEventHandlers()      
      logUsers()
    });
  }

  let onDisconnect = () => {
    console.log("Client disconnected");    
    // Remove user from state on disconnect
    stateChanged = true;
    delete users[id];
  }
  
  /** Event Handlers */
  let setEventHandlers = () => {
    /** socket.on('event', eventHandler) */
    socket.on("disconnect", onDisconnect)
    socket.on("positionUpdate", onPositionUpdate)  
    socket.on("sceneUpdate", onSceneUpdate)  
    socket.on("initialize", onInitialize)  
    socket.on("userLoginRequest", onUserLoginRequest)
    socket.on("userProfileRequest", onUserProfileRequest)
    socket.on("userParticipatedGroupRequest", onUserParticipatedGroupRequest)
    socket.on("joinTextChat", onJoinGroup)
    socket.on("leaveTextChat", onLeaveGroup)
    socket.on("sendGroupMessage", onSendGroupMessage)
    socket.on("sendPrivateMessage", onSendPrivateMessage)
    socket.on("updateGroupStatus", onUpdateGroupStatus)
  }

  /* Home scene */
  let onUserLoginRequest = userID => {
    if (!userList[userID]) {
      socket.emit("userLoginFail");
    } else {
      socket.emit("userLoginOK", userID);
    }
  }
  
  let onUserProfileRequest = userID => {
    socket.emit("userProfile", userList[userID]);
  }

  /* 아직 오류 있음; 추가적인 구조 수정 필요 */
  let onUserParticipatedGroupRequest = userID => {
    let response = [];
    Object.entries(groupList).forEach(([key, value]) => {
      if (value.member[userID] !== groupList[]) {
        response.append(value);
      }
    });
    socket.emit("userParticipatedGroup", response);
  }  

  /* 아직 오류 있음 */
  let onJoinGroup = (groupID, userID) => {
    socket.join(groups[groupID], () => {
      console.log(userID + ' join a ' + room[groupID]);
      io.to(room[groupID]).emit("joinGroup", groupID, userID);
    });
  }

    /* 아직 오류 있음 */
  let onLeaveGroup = (groupID, userID) => {
    socket.leave(groups[groupID], () => {
      console.log(userID + ' leave a ' + room[groupID]);
      io.to(room[groupID]).emit("leaveGroup", groupID, userID);
    });
  }
  
  /* 아직 오류 있음 */
  let onSendGroupMessage = (groupID, userID, msg) => {
    a = groupID;
    io.to(groups[a]).emit('chat message', userID, msg);
  }

  /* 아직 오류 있음 */
  let onSendPrivateMessage = (user1ID, user2ID, msg) => {
    io.to(users[user1ID]).emit('chat message', user2ID, msg);
  }

  /* 아직 오류 있음 */
  let onUpdateGroupStatus = (groupID, stat) => {
    if (!groupList[groupID]) {S
      socket.emit("findingGroupFail");
    } else {
      let group = groupList[groupID];
      group.status = stat;
    }
  }

  let onPositionUpdate = (positionData) => {
    if (!Object.keys(users).includes(id)){
      return
    }
    stateChanged = true;
    let user = users[id];
    user.position = positionData;
  }
  
  let onSceneUpdate = (scene) => {
    console.log('Client moved to {} scene'.format(scene))
    stateChanged = true;
    let user = users[id];
    user.scene = scenes[newScene]
    socket.join(newScene);    
    socket.leave(prevScene);
  }
  
  let onInitialize = (data) => {
    console.log("New user initialized");
    stateChanged = true;    
  
    // Create a new user object
    let newUser = createUser(id, data.name, data.group, data.position, data.scene);

    // Add the newly created user to game state.
    users[id] = newUser;
  
    socket.broadcast.emit("initialize", id, data.name, data.group, data.position)
  
    //On first user joined, start update emit loop
    if (numUsers() === 1 && !isEmittingUpdates) {
      emitStateUpdateLoop('room');
    }
  }

  /** Helpers */

  /** 
   * Loop that emits real-time data 
   * - positions {id : {x:x, y:y}}
  */
  let emitStateUpdateLoop = (room) => {
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

  let numUsers = () =>  {
    return Object.keys(users).length;
  }
  
  let createUser = (id, name, group, position) => {
    return({id,
      name,
      group,
      position
    })
  }

  /** log */  
  let logUsers = () =>  {
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
    socket, // server socket
    id, // socket id
    scenes : {'FirstScene' : 1, 'SecondScene' : 2}, // scenes

    /** Methods */
    init 
  }
}

module.exports = SocketIOServer