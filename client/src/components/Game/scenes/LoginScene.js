import Phaser from 'phaser';

export default class Login extends Phaser.Scene {
    constructor() {
        super('Login');
        console.log("Welcome to ", 'Login'); 
    }

    preload() {

    }
    create() {

    }
    update() {
        if (this.game.registry.get("loginUser") !== null){
            console.log(this.game.registry.get("loginUser"))
            this.scene.start('Library', "newLoginUser");
        }
    }

    // setEventHandlers(){
    //     this.game.events.on("EVENT_ID", this.onEventID, this);
    // }

    // onEventID(user){
    //     // console.log('Log. mapscene.onEventID() user  =', user);    
    //     this.socketID = user.socketID;
    //     this.userID = user.userID;  
    //     console.log('Log. LoginScene.onEventID() socketID | userID  =', this.socketID, this.userID);
    // }
}