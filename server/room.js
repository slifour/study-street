/**
 * Rooms
 * 한 Scene 안에서 현재 위치하고 있는 user들과 그 위치를 다루기 위한 class 입니다.
 * SocketIOServer() 에서
 * libraryRoom = new Rooms("Library")
 * restRoom = new Rooms("Room")
 * 을 선언해서 사용합니다.
 * Rooms.positionList = { "Hyeon" : {x : 100, y : 100}, ...} 에 위치를 저장합니다.
 * 
 * User 가 scene 에 새로 들어오면 리스트의 항목을 새로 만들고 다른 scene으로 떠나면 삭제합니다.
 * @ 지금은 login id 대신 socket id 를 key로 사용하고 있습니다. * 
 */
module.exports = class Rooms {
    constructor(room){
        this.io;
        this.socket;
        this.room = room;
        this.updateInterval = 200;
        this.positionList = {};
        this.isEmittingUpdates = false;   
        this.stateChanged = false;
    }

    init(io, socket){
        this.io = io;
        this.socket = socket;
    }

    broadcast(response, payload){
        this.io.to(this.room).emit(response, payload)
    }

    getNumUsers(){
        return (Object.keys(this.positionList).length);
    }

    update(socket, id, x, y){
        this.positionList[id] = {x:x, y:y};
        console.log(this.positionList[id]);
        this.stateChanged = true;
        socket.join(this.room);
        if (this.getNumUsers() === 2 && !this.isEmittingUpdates) {
            this.emitLoop();
        }
    }

    remove(socket, id){
        if (!Object.keys(this.positionList).includes(id)){
            return;
        }
        socket.leave(this.room);
        delete this.positionList[id];
        this.stateChanged = true;
        this.broadcast("RESPONSE_REMOVE_FRIEND", id);
    }

    emitLoop(){
        this.isEmittingUpdates = true;        
        if (this.stateChanged) {
            this.stateChanged = false;
            this.broadcast("LOOP_POSITION", this.positionList);
            console.log("LOOP_POSITION", this.room)
        }        
        if (this.getNumUsers() > 1) {
            setTimeout(this.emitLoop.bind(this), this.updateInterval);
        } 
        else {
            this.isEmittingUpdates = false;
        }
    }
}
