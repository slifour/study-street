import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
import Study from './StudyScene';
import GroupArea from '../entity/GroupArea';
import Desk from '../entity/Desk';
import Book from '../entity/Book';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";
/** 
 * class MapScene
 * @ extends : Phaser.Scene 
 * @ extended by : FirstScene, SecondScene (all the scenes in form of navigatable map)
 * @ Reference
 * Phaser Scene class inheritance : https://youtu.be/1P8jvnj85e4
 * 
 */

export default class MapScene extends Phaser.Scene {
  constructor(key) {
    super(key);  
    this.key = key;    
    this.socket = socket;     
    this.friendDict = {};
  }

  init(data) {       
    // if(this.game.registry.get("loginUser") == undefined ){
    //   this.scene.pause()
    // }    
    // this.userID = this.game.registry.get("loginUser").userID;
    this.prevScene = (data === undefined) ? undefined : data.prevScene    
    console.log("Welcome to ", this.key);  

    const loginUser = this.game.registry.get("loginUser");
    this.socketID = loginUser.socketID;
    this.userID = loginUser.userID;
    // console.log("this.registry.get", this.game.registry.get("loginUser"))

  }

  // onResponseConnect(payload) {
  //   this.socketID = payload.socketID;  
  //   console.log("Log. mapscene.onResponseConnect() mapscene.socketID =", this.socketID)
  // }

  preload() {
    this.load.spritesheet('user-girl', 'assets/spriteSheets/user_1.png', {
        frameWidth: 32 * (100/3),
        frameHeight: 42 * (100/3)
    });
    this.load.spritesheet('user-wizard', 'assets/spriteSheets/wizard.png', {
        frameWidth: 60,
        frameHeight: 90
    });
    this.load.spritesheet('booksheet', 'assets/spriteSheets/booksheet.png', {
        frameWidth: 28,
        frameHeight: 35
    });
    this.load.html('newArtifact', 'assets/NewArtifact.html');
    this.load.html('alert', 'assets/NewAlert.html');
  }

  create() {   
    
    /** Create Animations */
    createCharacterAnimsWizard(this.anims);
    createCharacterAnimsGirl(this.anims);

    /** Create Inputs */
    this.cursors = this.input.keyboard.createCursorKeys();

    /** Create User Avatar */
    this.createUser();
  }

  update() {
    this.user.update(this.cursors);
    // if (Object.entries(this.friendDict).length !== 0){
    //   Object.values(this.friendDict).forEach(friend => {friend.update();});
    // }
  };

  createUser() {
    this.user = new User(this, 800, 400, 'user-girl', 'girl').setScale(3/100 * 1.2); 
    this.user.init();   
    this.user.setDepth(1);
    this.physics.add.collider(this.user, this.belowPlayer1);
    this.physics.add.collider(this.user, this.world1);

    this.updateCamera();
  }

  /** createPortal
   * @parameter x, y, deskKey : fspritekey for desk, chairkey : spritekey for chair
   * @return Desk : extends sprite, defined in entity/Desk.js
   */
  createPortal(position){       
      this.portal = this.add.circle(position.x, position.y, 200, 0xffffff, 0.5).setScale(1, 0.2);
      this.portalCollider = this.add.circle(position.x, position.y, 150).setScale(1, 0.2);
      this.physics.world.enable(this.portalCollider);
      this.portalCollider.body.setImmovable(true);
      this.physics.add.collider(this.user, this.portalCollider, (() => {
          this.user.disableBody(false);
          let newScene = this.key === 'Library'? 'Rest' : 'Library';
          this.changeScene(newScene, null);
      }));
  }

  updateCamera() {    
    this.cameras.main.startFollow(this.user);
    this.cameras.main.roundPixels = true; // avoid tile bleed
    /**
     * 주석 처리된 경우 카메라가 맵 밖으로까지 이동해서 맵 바깥쪽 어두운 부분이 보입니다.
     * setBounds 를 다음과 같이 하면 카메라가 맵 밖으로 안나가게 가둬둘 수 있습니다. 문제는
     * this.world1.displayHeight가 1228.8 이 나오는데 width 보다도 훨씬 짧아서 맵의 절반까지 밖에 커버가 안됩니다. 왜일까요 ?
     * 
     */
    this.cameras.main.setBounds(0, 0, this.belowPlayer1.displayWidth, this.belowPlayer1.displayHeight);
  }

  onLoopPosition(socketIDToPosition){
    console.log("onLoopPosition", this.friendDict);

    if(this.friendDict === undefined) {return;}    
    Object.entries(socketIDToPosition).forEach(([socketID, position])=>{  
      console.log("this", this);
      console.log(socketID, this.socketID);      
      console.log('Log. mapscene.friendDict =', this.friendDict);
      console.log('Log. mapscene.onLoopPosition socketIDToPosition =', socketIDToPosition);

      if (socketID === this.socketID) {console.log('returned'); return;}

      if (Object.keys(this.friendDict).includes(socketID)){
        this.friendDict[socketID].updateMovement(position.x, position.y);
      } 
      else {                
        let friend = new Friend(this, position.x, position.y, 'user-wizard', 'wizard', socketID).setScale(1);
        friend.init();
        this.friendDict[socketID] = friend;
      }    
    });
  }

  onResponseCreateFriend(payload){
    let socketID = payload.loginUser.socketID;
    const friend = new Friend(this, payload.x, payload.y, 'user-wizard', 'wizard', payload.loginUser).setScale(1);
    friend.init();
    this.friendDict[socketID] = friend;
  }

  onResponseRemoveFriend(socketID){
    if (Object.keys(this.friendDict).includes(socketID)){
      this.friendDict[socketID].destroy();
      delete this.friendDict[socketID];
    }
  }


  
  setEventHandlers(){
    // Description
    // socket.on('event', eventHandler)  
    this.game.events.on("EVENT_ID", this.onEventID, this);
    if(this.socket !== undefined){      
      // this.socket.on("RESPONSE_CONNECT", this.onResponseConnect.bind(this));
      this.socket.on("LOOP_POSITION", this.onLoopPosition.bind(this));
      this.socket.on("RESPONSE_CREATE_FRIEND", this.onResponseCreateFriend.bind(this));
      this.socket.on("RESPONSE_REMOVE_FRIEND", this.onResponseRemoveFriend.bind(this));
    }
  }

  onEventID(user){
    // console.log('Log. mapscene.onEventID() user  =', user);    
    this.socketID = user.socketID;
    this.userID = user.userID;  
    console.log('Log. mapscene.onEventID() socketID | userID  =', this.socketID, this.userID);
  }


  changeScene(newScene, index){
    this.game.events.emit("changeScene", newScene);
    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
        // this.doUpdate = false
        let data = {index : index, prevScene: this.key};
        console.log('this.scene.start:', data);
        this.socket.removeAllListeners();
        this.scene.start(newScene, data);
    })  
  }   
    // if (newScene === 'Study'){
    //   this.scene.start(newScene);
    // }
    // else{
    //   this.cameras.main.fadeOut(1000, 0, 0, 0)
    //   this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
    //       // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
    //       // this.doUpdate = false
    //       this.scene.start(newScene);
    //   })  
    // }
}
