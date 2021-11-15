module.exports = class Rooms {
    constructor(room){
        this.socket;
        this.room = room;
        this.updateInterval = 250;
        this.numUsers = 0;
        this.positionList = {};
    }

    init(socket){
        this.socket = socket;
    }

    broadcast(response, payload){
        this.socket.to(this.room).emit(response, payload)
    }

    add(id, x = 0, y = 0){
        this.socket.join(this.room)
        this.positionList[id] = {x:x, y:y};
        this.numUsers += 1; 
        if (this.numUsers === 2 && !this.isEmittingUpdates) {
            this.update()
        }
    }

    remove(id, x, y){
        this.socket.leave(this.room)
        delete this.positionList[id];
        this.numUsers -= 1; 
    }

    update(){
        this.isEmittingUpdates = true;        
        if (this.stateChanged) {
            this.stateChanged = false;
            this.broadcast("LOOP_POSITION", this.positionList);
        }        
        if (this.numUsers > 1) {
            setTimeout(this.update.bind(this), this.updateInterval);
        } 
        else {
            this.isEmittingUpdates = false;
        }
    }
}


