/** Reference
 * https://github.com/ChrisArasin/simple-multiplayer-client/blob/main/src/socket.js
 * 
 * https://stackoverflow.com/questions/36120119/reactjs-how-to-share-a-websocket-between-components
 * 
 */
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";

class Socket {
  init(endpoint, updateSelfId, handleStateUpdate) {
    this.socket = socketIOClient(endpoint);
    this.id = this.socket.
    this.socket.on('connect', () => {
      // Get self ID from the connected socket and store
      updateSelfId(this.socket.id);

      // register for state updates from the server
      // this.socket.on('stateUpdate', handleStateUpdate);

      // tell server to create the player with a color
      // this.socket.emit('initialize', { color: color });
    });
  }
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  }

  handleUpdate(update, handleStateUpdate){
    this.socket.on(update, handleStateUpdate)
  }
  
}

const socket = new Socket();
socket.init(ENDPOINT, handleStateUpdate);

export default socket;
