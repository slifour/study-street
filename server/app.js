const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // < Interesting!

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};


// Player state of connected players, name, groups and locations
const players = {};

const createPlayer = (id, name, group, position) => ({
  id,
  name,
  group,
  position
});

function numPlayers() {
  return Object.keys(players).length;
}

/** */
let stateChanged = false;
let isEmittingUpdates = false;
const stateUpdateInterval = 300;

/** 
 * Player data를 한 개 dictionary에만 저장하지 않고
 * id 를 키로 하는 여러개 dictionary에 저장하는게 어떨까
 * e.g. 
 * positionDict = {id : {x:x, y:y}}
 * groupDict = {id : [1]}
*/ 

/** 
 * Loop that emits real-time data 
 * - positions {id : {x:x, y:y}}
*/
function emitStateUpdateLoop() {
  isEmittingUpdates = true;
  // Reduce usage by only send state update if state has changed
  if (stateChanged) {
    stateChanged = false;
    io.emit("stateUpdate", players);
    console.log("stateUpdate")
  }

  if (numPlayers() > 0) {
    setTimeout(emitStateUpdateLoop, stateUpdateInterval);
  } else {
    // Stop the setTimeout loop if there are no players left
    isEmittingUpdates = false;
  }
}  

/** log */
const logInterval = 5000;

function logPlayers() {
  console.log(players);
  setTimeout(logPlayers, logInterval);
}

logPlayers()

let interval;

/** socket emission from clients handled here */
io.on("connection", (socket) => {
  console.log("New client connected");
  var id = socket.id;
  socket.emit("id", id);

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);


  socket.on("disconnect", function() {
    console.log("Client disconnected");    
    // Remove player from state on disconnect
    stateChanged = true;
    delete players[socket.id];   
    clearInterval(interval);
  });

  socket.on("positionUpdate", function(positionData) {
    let id = socket.id
    if (! Object.keys(players).includes(id)){
      return
    }
    stateChanged = true;
    let player = players[socket.id];
    player.position = positionData;
  });

  socket.on("initialize", function(data) {
    console.log("New player initialized");
    stateChanged = true;    

    // Create a new player object
    var newPlayer = createPlayer(id, data.name, data.group, data.position);

    // Add the newly created player to game state.
    players[id] = newPlayer;

    socket.broadcast.emit("initialize", socket.id, data.name, data.group, data.position)

    //On first player joined, start update emit loop
    if (numPlayers() === 1 && !isEmittingUpdates) {
      emitStateUpdateLoop();
    }
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));


