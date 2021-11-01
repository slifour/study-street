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
  let stateChanged = false // flag whether state is changed = for transmission efficientcy
  let isEmittingUpdates = false // flag whether server is emitting updates = to prevent redundant emission and coliision
  let stateUpdateInterval = 300 // interval to update player states
  let logInterval = 5000 // interval to stamp logs
  let players = {} // players data structure
  let socket // server socket
  let id // socket id
  let scenes = {'FirstScene' : 1, 'SecondScene' : 2} // scenes
  let io

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
      logPlayers()
    });
  }

  /** Event Handlers */
  let setEventHandlers = () => {
    /** socket.on('event', eventHandler) */
    socket.on("disconnect", onDisconnect)
    socket.on("positionUpdate", onPositionUpdate)  
    socket.on("sceneUpdate", onSceneUpdate)  
    socket.on("initialize", onInitialize)  
  }
  
  let onDisconnect = () => {
    console.log("Client disconnected");    
    // Remove player from state on disconnect
    stateChanged = true;
    delete players[id];
  }
  
  let onPositionUpdate = (positionData) => {
    if (!Object.keys(players).includes(id)){
      return
    }
    stateChanged = true;
    let player = players[id];
    player.position = positionData;
  }
  
  let onSceneUpdate = (scene) => {
    console.log('Client moved to {} scene'.format(scene))
    stateChanged = true;
    let player = players[id];
    player.scene = scenes[newScene]
    socket.join(newScene);    
    socket.leave(prevScene);
  }
  
  let onInitialize = (data) => {
    console.log("New player initialized");
    stateChanged = true;    
  
    // Create a new player object
    let newPlayer = createPlayer(id, data.name, data.group, data.position, data.scene);

    // Add the newly created player to game state.
    players[id] = newPlayer;
  
    socket.broadcast.emit("initialize", id, data.name, data.group, data.position)
  
    //On first player joined, start update emit loop
    if (numPlayers() === 1 && !isEmittingUpdates) {
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
      io.emit("stateUpdate", players);
      console.log("stateUpdate")
    }

    if (numPlayers() > 0) {
      setTimeout(emitStateUpdateLoop.bind(this), stateUpdateInterval);
    } else {
      // Stop the setTimeout loop if there are no players left
      isEmittingUpdates = false;
    }
  }

  let numPlayers = () =>  {
    return Object.keys(players).length;
  }
  
  let createPlayer = (id, name, group, position) => {
    return({id,
      name,
      group,
      position
    })
  }

  /** log */  
  let logPlayers = () =>  {
    console.log(players);
    setTimeout(logPlayers.bind(this), logInterval);
  }   

  return {
    /** Variables */
    stateChanged : false, // flag whether state is changed : for transmission efficientcy
    isEmittingUpdates : false, // flag whether server is emitting updates : to prevent redundant emission and coliision
    stateUpdateInterval : 300, // interval to update player states
    logInterval : 5000, // interval to stamp logs
    players : {}, // players data structure
    socket, // server socket
    id, // socket id
    scenes : {'FirstScene' : 1, 'SecondScene' : 2}, // scenes

    /** Methods */
    init 
  }
}

module.exports = SocketIOServer