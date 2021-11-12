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

const ENDPOINT = "";
const socket = socketIOClient(ENDPOINT);

export default socket;
