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

let { userList, groupList } = require("./database");

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;
/** 
 * @type {Object.<string, {
 *  flipX: boolean,
 *  x: number,
 *  y: number,
 *  userId: string,
 *  scene: string
 * }>}
 */
const users = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  /* 1초에 한번씩 소켓에 데이터를 emit하기 */
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.broadcast.emit("newUser", {
    x: 0,
    y: 0,
    userId: socket.id
  })

  users[socket.id] = {
    flipX: false,
    x: 0,
    y: 0,
    userId: socket.id,
    scene: 'Library'
  };

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on('userMovement', function (movement) {
    users[socket.id] = {
      ...users[socket.id],
      x: movement.x,
      y: movement.y,
      flipX: movement.flipX
    };
    socket.broadcast.emit("userMovementBroadcast", movement);
  });

  /* Home scene */
  socket.on("userLoginRequest", userID => {
    if (!userList[userID]) {
      socket.emit("userLoginFail");
    } else {
      socket.emit("userLoginOK", userID);
    }
  });

  socket.on("userProfileRequest", userID => {
    socket.emit("userProfile", userList[userID]);
  });

  socket.on("userParticipatedGroupRequest", userID => {
    let response = [];
    Object.entries(groupList).forEach(([key, value]) => {
      if (value.member[userID] !== undefined) {
        response.append(value);
      }
    });
    socket.emit("userParticipatedGroup", response);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));