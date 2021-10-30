/** Reference
 * https://github.com/ChrisArasin/simple-multiplayer-client/blob/main/src/socket.js
 * 
 * https://stackoverflow.com/questions/36120119/reactjs-how-to-share-a-websocket-between-components
 * 
 */
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:4001";


class Network {
  /** Properties */
  /** players : client's version of players data */

  /** Methods */
  /** init : initialize socket connection. Listen to 'stateUpdate' */
  init(endpoint) {
    this.socket = socketIOClient(endpoint);
    this.socket.on('connect', () => {
      this.socket.on('id', id =>{
        this.id = id
      })
      // register for state updates from the server
      // this.socket.on('stateUpdate', this.handleStateUpdate);
    });
  }

  /** handleStateUpdate : called when 'stateUpdate' */
  handleStateUpdate() {
    console.log("handleStateUpdate")
  };

  // playerData : { name : name(str), group : group(int), position : {x: x. y:y} }
  /** initialize : tell server to create this player */
  initialize(playerData) {    
    this.socket.emit('initialize', playerData);
  };

  /** sendPosition : tell server to move this player */
  sendPosition(positionData) {
      this.socket.emit('positionUpdate', positionData);
  };
}

const network = new Network();
network.init(ENDPOINT);

export default network;
