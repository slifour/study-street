import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";
export const socket = socketIOClient(ENDPOINT);