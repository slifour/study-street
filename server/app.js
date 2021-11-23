/**
 * app.js
 * 
 * @ Reference
 *  Socket Room : https://socket.io/docs/v3/rooms/
 */
const express = require("express");
const http = require("http");

const port = process.env.port || 4001;
const indexRoute = require("./routes/index");
const adminRoute = require("./routes/admin");

const app = express();
app.use(indexRoute);
app.use("/admin", adminRoute);
app.use('/public', express.static('public'));

const server = http.createServer(app);

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

const SocketIOServer = require("./socketIOServer.js");
const socketIOServer = SocketIOServer();
socketIOServer.init(server);

server.listen(port, () => console.log(`Listening on port ${port}`));