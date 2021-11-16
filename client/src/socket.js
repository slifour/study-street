/**
 * socket.js
 * - Shared Socket
 * - client socket is declared here and shared by client modules
 * - import socket from '../../socketConfig';
 * socket = socket;
 * 
 * https://github.com/ChrisArasin/simple-multiplayer-client/blob/main/src/socket.js
 * 
 * https://stackoverflow.com/questions/36120119/reactjs-how-to-share-a-websocket-between-components
 * 
 */
import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://localhost:4001";
const ENDPOINT = process.env.NODE_ENV === "production" ? 
  "https://study-street-server.herokuapp.com" : "http://localhost:4001";

const socket = socketIOClient(ENDPOINT);

export default socket;