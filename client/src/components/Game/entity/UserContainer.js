import Phaser, { GameObjects } from "phaser";
import uniqueString from 'unique-string';
import socket from '../../../socket';
import { getParsedDuration } from '../utils/Time';
import Status from './Status';
import StatusText from "./StatusText";

class UserSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix, sizeFactor) {
    super(scene, x, y, spriteKey);
    // this.setBodySize(this.width*sizeFactor, this.height*sizeFactor)
    // console.log("consturctor", this.width, sizeFactor, this.height*sizeFactor)
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.setSize(this.width*sizeFactor, this.height*sizeFactor);
    this.setDisplaySize(this.width*sizeFactor, this.height*sizeFactor);
    this.width = this.width*sizeFactor;
    this.height = this.height*sizeFactor
    this.setInteractive()

    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
  }

  /** Update methods */
  /** @param {string} state  */
  updateAnimation(state){
    this.play(state, true);    
  }
}

export default class UserContainer extends GameObjects.Container{
  constructor(scene, position, spriteKey, animSuffix, loginUser, sizeFactor = 1, initialtext = "") {
    super(scene, position.x, position.y);
    this.userID = loginUser.userID
    this.userName = loginUser.userName;
    this.chair = null;
    console.log("Log. UserContainer() userName=", this.userName)
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    // this.body.setCollideWorldBounds(true);

    this.createSprite(scene, spriteKey, animSuffix, sizeFactor);
    console.log("createSprite", this.sprite.width, this.sprite.height)
    console.log("createSprite", this.sprite.displayWidth, this.sprite.displayHeight)
    console.log("createSprite", this.sprite.listeners('pointerover'), this.sprite.active)
    this.createName();
    this.createStatus(loginUser.status === null ? initialtext : loginUser.status, loginUser.todayStudyTime);
    this.setInteractive();
    this.setInteractions();
  }

  init(){
    // this.prepareStatusView();
    /* Status display */
    console.log("UserContainer, init()");
    // this.sprite.setInteractive();
    // this.setInteractions();    

    this.requestKey = null;
    this.onResponseOK = null;
    this.onResponseFail = null;
  }

  setInteractions(setInteractionsbool = true){
    this.sprite.removeAllListeners();
    if(setInteractionsbool){
      this.on('pointerdown', this.status.onPointerDown);
      this.sprite.on('pointerover', this.onPointerOver, this); 
      this.sprite.on('pointerout', this.onPointerOut, this);
    }
  }  

  update(){
    this.statusView.update();
  }

  updateStatus(status, todayStudyTime){
    this.status.update(status, todayStudyTime);
  }

  createSprite(scene, spriteKey, animSuffix, sizeFactor) {
    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
    this.sprite = new UserSprite(scene, 0, 0, spriteKey, animSuffix, sizeFactor);
    this.add(this.sprite);
    this.width = this.sprite.displayWidth;
    this.height = this.sprite.displayHeight;
    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    // this.setDisplaySize(this.sprite.displayWidth, this.sprite.displayHeight);
    // this.body.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
  }

  createName() {
    console.log('createName', this.userName)
    this.namePadding = 10;
    this.name = this.scene.add.text(0, -(this.sprite.height/2 + this.namePadding), this.userName, { 
    // this.name = this.scene.add.text(0, 0, this.userName, { 
      fontSize: '14px', 
      fontFamily: 'Lato',
      color: '#ffffff',
      backgroundColor: "000000",
      align:'center', });
    this.name.setOrigin(0.5, 0);
    console.log(this.name);
    this.add(this.name);
  }

  createStatus(initialtext, todayStudyTime) {
    this.namePadding = -10;
    this.status = new StatusText(this.scene, 0, 0, initialtext, todayStudyTime);
    // this.scene.add.existing(this.status);
    this.status.setInteractive();
    this.status.setInteractions();
    console.log(this.status);
    this.add(this.status);
    // this.status.setVisible(false);
    this.status.setSize(10);
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  onPointerOver() {
    console.log("onPointerOver()")
    this.status.showStatus()
  }

  onPointerOut() {
    this.status.onPointerOut();
    const responseType = "RESPONSE_MY_PROFILE";

    this.statusView.onPointerOut();

    socket.off(responseType, this.onResponse);
  }

  showStatus() {
    this.status.setVisible(true);
  }

  closeSatusView() {
    this.statusView.setActive(false).setVisible(false);
  }

  sit(desk, chairIndex){
    let indexer = 1;
    let marginX = -5;
    let marginY = 0;
    let frame = 0;
    this.chair = desk.indexToChair[chairIndex];
    if (this.chair === 'down'){
      indexer = 0;
      marginY = -10;
      frame = 11
    }
    this.setPosition(this.chair.x+marginX, this.chair.y + marginY);
    this.sprite.setFrame(frame);
    let chairAt = desk.getIndex(this.chair)
    desk.addAt(this, chairAt + indexer)

    this.chair.setInteractions(false);
    console.log("sit", this.chair.x, this.chair.y, this.x, this.y);
    // this.status
  }

}