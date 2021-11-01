/**
 * class socketIOServer
 * 
 * @ Reference
 */

const socketIo = require("socket.io");

class SocketIOServer {
    /** Constructor */  
  constructor() {
    this.stateChanged = false;
    this.isEmittingUpdates = false;
    this.stateUpdateInterval = 300;
    this.logInterval = 5000;
    // Player state of connected players, name, groups and locations
    this.players = {};
    this.socket
    this.id
    this.scenes = {'FirstScene' : 1, 'SecondScene' : 2}
  }

  /** Methods */
  /** Initialize */  
  init(server, origin) {
    this.io = socketIo(server, {
      cors: {
        origin: origin,
        methods: ["GET", "POST"]
      }
    }); // < Interesting!

    this.io.on("connection", (socket) => {
      console.log("New client connected");
      this.socket = socket 
      this.id = socket.id
      this.socket.emit("id", this.id);
      this.setEventHandlers()      
      this.logPlayers()
    })
  }

  /** Event Handlers */
  setEventHandlers(){
    /** this.socket.on('event', eventHandler) */
    this.socket.on("disconnect", this.onDisconnect.bind(this))
    this.socket.on("positionUpdate", this.onPositionUpdate.bind(this))  
    this.socket.on("sceneUpdate", this.onSceneUpdate.bind(this))  
    this.socket.on("initialize", this.onInitialize.bind(this))  
  }
  
  onDisconnect(){
    console.log("Client disconnected");    
    // Remove player from state on disconnect
    this.stateChanged = true;
    delete this.players[this.id];
  };
  
  onPositionUpdate(positionData) {
    if (!Object.keys(this.players).includes(this.id)){
      return
    }
    this.stateChanged = true;
    let player = this.players[this.id];
    player.position = positionData;
  };
  
  onSceneUpdate(scene) {
    console.log('Client moved to {} scene'.format(scene))
    this.stateChanged = true;
    let player = this.players[this.id];
    player.scene = this.scenes[newScene]
    this.socket.join(newScene);    
    this.socket.leave(prevScene);
  };
  
  onInitialize(data) {
    console.log("New player initialized");
    this.stateChanged = true;    
  
    // Create a new player object
    let newPlayer = this.createPlayer(this.id, data.name, data.group, data.position, scene);

    // Add the newly created player to game state.
    this.players[this.id] = newPlayer;
  
    this.socket.broadcast.emit("initialize", this.id, data.name, data.group, data.position)
  
    //On first player joined, start update emit loop
    if (this.numPlayers() === 1 && !this.isEmittingUpdates) {
      this.emitStateUpdateLoop('room');
    }
  }

  /** Helpers */

  /** 
   * Loop that emits real-time data 
   * - positions {id : {x:x, y:y}}
  */
  emitStateUpdateLoop(room) {
    this.isEmittingUpdates = true;
    // Reduce usage by only send state update if state has changed
    if (this.stateChanged) {
      this.stateChanged = false;
      this.io.emit("stateUpdate", this.players);
      console.log("stateUpdate")
    }

    if (this.numPlayers() > 0) {
      setTimeout(this.emitStateUpdateLoop.bind(this), this.stateUpdateInterval);
    } else {
      // Stop the setTimeout loop if there are no players left
      this.isEmittingUpdates = false;
    }
  }  

  numPlayers() {
    return Object.keys(this.players).length;
  }
  
  createPlayer(id, name, group, position){
    return({id,
      name,
      group,
      position
    })
  }

  /** log */  
  logPlayers() {
    console.log(this.players);
    setTimeout(this.logPlayers.bind(this), this.logInterval);
  }
}

module.exports = SocketIOServer