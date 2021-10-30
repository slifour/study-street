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
    this.players = {}
    this.readyForUpdate = false
    this.socket = socketIOClient(endpoint);
    this.socket.on('connect', () => {
      this.socket.on('id', id =>{
        this.id = id
      })
      // register for state updates from the server
      this.socket.on('stateUpdate', this.handleStateUpdate);
    });
  }

  /** handleStateUpdate : called when 'stateUpdate' */
  handleStateUpdate(players) {
    this.readyForUpdate = true    
    this.players = players
    console.log("handleStateUpdate", this.players, this.readyForUpdate)
  };

  // playerData : { name : name(str), group : group(int) }
  /** initialize : tell server to create this player */
  initialize(playerData) {    
    this.socket.emit('initialize', playerData);
    // Create a new player object
    var newPlayer = this.createPlayer(this.id, playerData);

    // Add the newly created player to game state.
    this.players[this.id] = newPlayer;
  };

  createPlayer = (id, playerData) => ({
    id,
    name: playerData.name,
    group: playerData.group,
    position: playerData.position // all players begin in the center of the board
  });
  
  sendPosition(positionData) {
    if(Object.keys(this.players).includes(this.id)){
      console.log('positionData :', positionData)
      console.log('this.players[this.id].position :', this.players[this.id].position)
      if (this.players[this.id].position !== positionData){
        this.socket.emit('positionUpdate', positionData);
      }
    };
  };
}

const network = new Network();
network.init(ENDPOINT);

export default network;
