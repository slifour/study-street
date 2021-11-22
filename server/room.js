/**
 * Rooms
 * 한 Scene 안에서 현재 위치하고 있는 user들과 그 위치를 다루기 위한 class 입니다.
 * SocketIOServer() 에서
 * libraryRoom = new Rooms("Library")
 * restRoom = new Rooms("Room")
 * 을 선언해서 사용합니다.
 * Rooms.socketIDToPosition = { "Hyeon" : {x : 100, y : 100}, ...} 에 위치를 저장합니다.
 * 
 * User 가 scene 에 새로 들어오면 리스트의 항목을 새로 만들고 다른 scene으로 떠나면 삭제합니다.
 * @ 지금은 login id 대신 socket id 를 key로 사용하고 있습니다. * 
 */
 let { userList } = require("./database");

module.exports = class Rooms {
    constructor(room){
        this.io;
        this.socket;
        this.room = room;
        this.updateInterval = 200;
        this.socketIDToPosition = {};
        this.userIDToChairs = {};
        this.idList = {};
        this.isEmittingUpdates = false;   
        this.isEmittingUpdatesStudying = false; 
        this.stateChanged = false;
        this.stateChangedStudying = false;        
    }

    init(io, socket){
        this.io = io;
        this.socket = socket;
    }

    broadcast(response, payload){
        this.io.to(this.room).emit(response, payload)
    }

    getNumUsers(){
        return (Object.keys(this.socketIDToPosition).length);
    }

    setUserId(socketID, userId){
        this.idList[socketID] = userId;
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    update(socket, x, y){
        let socketID = socket.id;
        this.socketIDToPosition[socketID] = {x:x, y:y};
        this.stateChanged = true;   
        console.log("Log: room.update() this.socketIDPositio[socketID] after update=", this.socketIDToPosition[socketID]);
    }

    add(socket, x, y, loginUser){
        let socketID = socket.id; 
        Object.entries(this.socketIDToPosition).forEach(([socketID, position]) => {
            let user = userList[this.idList[socketID]]
            socket.emit("RESPONSE_CREATE_FRIEND", {loginUser : user, x : position.x, y : position.y})
        })    
        Object.entries(this.userIDToChairs).forEach(([userID, chair]) => {
            let user = userList[userID]
            socket.emit("RESPONSE_FRIEND_START_STUDY", {loginUser : user, deskIndex : chair.deskIndex, chairIndex : chair.chairIndex})
        })    
        this.broadcast("RESPONSE_CREATE_FRIEND", {loginUser : loginUser, x : x, y : y});

        this.socketIDToPosition[socketID] = {x:x, y:y};   
        socket.join(this.room);
        if (this.getNumUsers() === 2 && !this.isEmittingUpdates) {
            this.emitLoop();
        }
    }

    remove(socket){
        let socketID = socket.id;
        if (Object.keys(this.idList).includes(socketID)){
            socket.leave(this.room);         
            delete this.idList[socketID];
            delete this.socketIDToPosition[socketID];
            this.broadcast("RESPONSE_REMOVE_FRIEND", socketID);
        }
    }

    emitLoop(){
        this.isEmittingUpdates = true;        
        if (this.stateChanged) {
            this.stateChanged = false;
            this.broadcast("LOOP_POSITION", this.socketIDToPosition);
            console.log("LOOP_POSITION", this.room)
        }        
        if (this.getNumUsers() > 1) {
            setTimeout(this.emitLoop.bind(this), this.updateInterval);
        } 
        else {
            this.isEmittingUpdates = false;
        }
    }

    sit(socket, deskIndex, chairIndex, loginUser){
        this.userIDToChairs[loginUser.userID] = {deskIndex : deskIndex, chairIndex : chairIndex};
        console.log('sit broadcst',  deskIndex, chairIndex, loginUser)
        this.broadcast("RESPONSE_FRIEND_START_STUDY", {loginUser : loginUser, deskIndex : deskIndex, chairIndex : chairIndex})
    }

    stand(socket, userID){
        let socketID = socket.id;
        if (Object.keys(this.userIDToChairs).includes(userID)){
            delete this.userIDToChairs[userID];
            this.broadcast("RESPONSE_FRIEND_STOP_FRIEND", socketID);
        }
    }
}
