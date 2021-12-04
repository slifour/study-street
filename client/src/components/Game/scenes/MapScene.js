import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsDefault, createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
import Request from '../request'
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
    this.loginUser = this.game.registry.get("loginUser");
    this.socketID = this.loginUser.socketID;
    this.userID = this.loginUser.userID;
    this.request = new Request(this.socket, this.loginUser);
    // console.log("this.registry.get", this.game.registry.get("loginUser"))

  }

  // onResponseConnect(payload) {
  //   this.socketID = payload.socketID;  
  //   console.log("Log. mapscene.onResponseConnect() mapscene.socketID =", this.socketID)
  // }

  preload() {
    const USER_SPRITESHEETS_MAX_INDEX = 4;
    for (var i = 1; i <= USER_SPRITESHEETS_MAX_INDEX; i += 1) {
      this.load.spritesheet(`user_${i}`, `assets/spriteSheets/user_${i}.png`, {
        frameWidth: 32 * (100/3),
        frameHeight: 42 * (100/3),
      });    
    }
    this.load.spritesheet(`user_5`, `assets/spriteSheets/user_pika.png`, {
      frameWidth: 64,
      frameHeight: 64,
    });  

    this.load.spritesheet(`user_6`, `assets/spriteSheets/user_host.png`, {
      frameWidth: (224/3),
      frameHeight: (368/4),
    });  

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
    createCharacterAnimsDefault(this.anims);

    /** Create Inputs */
    this.cursors = this.input.keyboard.createCursorKeys();

    /** Create User Avatar */
    this.createUser();
    this.initialize({prevScene : this.prevScene, currentScene : this.key});
  }

  update() {
    this.user.update(this.cursors);
  };

  /** initialize : tell server to create this user */
  initialize(payload) {    
    console.log('initialize :', payload)
    let request = new Request(this.socket, this.loginUser)
    request.request("REQUEST_CHANGE_SCENE", payload);
    // request(requestType, responseType, makePayload, onRequest, onResponseOK, onResponseFail, socket)
  };

  createUser() {
    console.log("Create user: Login user: ", this.loginUser);
    const avatarSprite = this.loginUser.avatarSprite || "user_1";
    const avatarAnimSuffix = avatarSprite; // user_1이 'girl' animation suffix에 해당하는데, 다른 user도 animation은 같아서 그대로 뒀어요.

    let scale = 0;
    switch (avatarSprite) {
      case "user_5": scale = 1.2; break;
      case "user_6": scale = 0.75; break;
      default : scale = 3/100 * 1.2;
    }

    this.user = new User(this, 800, 400, avatarSprite, avatarAnimSuffix, this.loginUser, scale);
    this.user.init();
    // this.user.setDepth(1);
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
      this.portalCollider = this.add.circle(position.x, position.y, 150).setScale(1, 0.2).setAlpha(0.1);
      this.physics.world.enable(this.portalCollider);
      this.portalCollider.body.setImmovable(true);
      this.physics.add.collider(this.user, this.portalCollider, (() => {
          this.user.sprite.disableBody(false);
          let newScene = this.key === 'Library'? 'Rest' : 'Library';
          this.changeScene(newScene, {prevScene : this.key, nextScene : 'rest'});
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
      else{        
        this.request.request("requestCreateFreind", {socketID : socketID});
      }

    });
  }

  createFriend(payload){
    let socketID = payload.loginUser.socketID;
    if (socketID === this.socketID) {
      return false;
    }
    if (this.key =='Library'){
      this.onResponseRemoveFriend(socketID);
      console.log("createFriend")
      this.onResponseFriendStopStudy(socketID);
    }


    const avatarSprite = payload.loginUser.avatarSprite || "user_1";
    const avatarAnimSuffix = avatarSprite;
    let scale = 0;
    switch (avatarSprite) {
      case "user_5": scale = 1.2; break;
      case "user_6": scale = 0.75; break;
      default : scale = 3/100 * 1.2;
    }

    const friend = new Friend(this, {x : payload.x, y: payload.y} , avatarSprite, avatarAnimSuffix, payload.loginUser, scale);
    friend.init();
    return friend;
  }

  onResponseCreateFriend(payload){
    const friend = this.createFriend(payload);
    if(!friend){
      return;
    }    
    this.physics.add.collider(friend, this.belowPlayer1);
    this.physics.add.collider(friend, this.world1);
    this.friendDict[payload.loginUser.socketID] = friend;  
  }

  onResponseRemoveFriend(socketID){
    if (Object.keys(this.friendDict).includes(socketID)){
      this.friendDict[socketID].destroy();
      delete this.friendDict[socketID];
    }
  }

  onResponseFriendStartStudy(payload){
    const friend = this.createFriend(payload);
    console.log("onResponseFriendStartStudy(payload)", payload);
    if(friend){
      console.log("if(friend)", payload.deskIndex, payload.chairIndex);
      this.friendDictStudying[payload.loginUser.socketID] = friend;
      if ((payload.deskIndex !== undefined) && (payload.chairIndex !== undefined)){
        console.log("friend.sit()", this.areas[payload.deskIndex].desk, payload.chairIndex);
        friend.sit(this.areas[payload.deskIndex].desk, payload.chairIndex)
      }
      else{
        return
      }
    }
  }
  
  onResponseFriendStopStudy(socketID){
    console.log("onResponseFriendStopStudy(socketID)", socketID, this.friendDictStudying);
    if (Object.keys(this.friendDictStudying).includes(socketID)){
      console.log("onResponseFriendStopStudy incluses");
      this.friendDictStudying[socketID].stand();
      this.friendDictStudying[socketID].destroy();
      delete this.friendDictStudying[socketID];
    }
  }  
  
  setEventHandlers(){
    // Description
    // socket.on('event', eventHandler)  
    // this.game.events.on("EVENT_ID", this.onEventID, this);
    if(this.socket !== undefined){      
      // this.socket.on("RESPONSE_CONNECT", this.onResponseConnect.bind(this));
      this.socket.on("LOOP_POSITION", this.onLoopPosition.bind(this));
      this.socket.on("RESPONSE_CREATE_FRIEND", this.onResponseCreateFriend.bind(this));
      this.socket.on("RESPONSE_REMOVE_FRIEND", this.onResponseRemoveFriend.bind(this));
      this.socket.on("RESPONSE_FRIEND_START_STUDY", this.onResponseFriendStartStudy.bind(this));
      this.socket.on("RESPONSE_FRIEND_STOP_STUDY", this.onResponseFriendStopStudy.bind(this));
      this.socket.on('RESPONSE_NEW_STATUS', this.onResponseNewStatus.bind(this));
    }
  }

  onResponseNewStatus(response){
    const {socketID, status, todayStudyTime} = response.payload
    console.log("onResponseNewStatus", socketID, status, response.payload)
    if (socketID === this.socketID) {
      console.log("if (socketID === this.socketID)")
      this.user.updateStatus(status, todayStudyTime);
    }
    else if (Object.keys(this.friendDict).includes(socketID)){
      this.friendDict[socketID].updateStatus(status, todayStudyTime);
    }
}

  onEventID(user){
    // console.log('Log. mapscene.onEventID() user  =', user);    
    this.socketID = user.socketID;
    this.userID = user.userID;  
    console.log('Log. mapscene.onEventID() socketID | userID  =', this.socketID, this.userID);
  }


  changeScene(newScene, data){
    console.log('this.scene.start:', data);
    this.game.events.emit("changeScene", newScene);
    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
        // this.doUpdate = false
        // data.prevScene = this.key;
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
