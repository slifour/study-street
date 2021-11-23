import Phaser, { GameObjects } from "phaser";
import uniqueString from 'unique-string';
import socket from '../../../socket';
import { getParsedDuration } from '../utils/Time';
import Status from './Status';

class UserSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    // this.setCollideWorldBounds(true);

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
  constructor(scene, position, spriteKey, animSuffix, loginUser) {
    super(scene, position.x, position.y);
    this.userID = loginUser.userID
    this.userName = loginUser.userName;
    console.log("Log. UserContainer() userName=", this.userName)
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.createSprite(scene, spriteKey, animSuffix);
    this.createName();
  }

  init(){
    this.prepareStatusView();
    /* Status display */
    this.setInteractive();
    this.setInteractions();    

    this.requestKey = null;
    this.onResponseOK = null;
    this.onResponseFail = null;
  }

  setInteractions(setInteractionsbool = true){
    if(setInteractionsbool){
      this.on('pointerover', this.onPointerOver); 
      this.on('pointerout', this.onPointerOut);
    }
    else{
      this.removeAllListeners();
    }
  }  

  update(){
    this.statusView.update();
  }

  createSprite(scene, spriteKey, animSuffix) {
    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
    this.sprite = new UserSprite(scene, 0, 0, spriteKey, animSuffix);
    this.add(this.sprite);
    this.width = this.sprite.displayWidth;
    this.height = this.sprite.displayHeight;
    this.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
    this.setDisplaySize(this.sprite.displayWidth, this.sprite.displayHeight);
    this.body.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
  }

  createName() {
    console.log('createName', this.userName)
    this.namePadding = -10;
    // this.name = this.scene.add.text(0, -(this.sprite.height/2 + this.namePadding), this.userName, { 
    this.name = this.scene.add.text(0, 0, this.userName, { 
      fontSize: '12px', 
      fontFamily: 'Lato',
      color: '#dddddd',
      align:'center', });
    console.log(this.name);
    this.add(this.name);
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  onPointerOver() {
    this.showStatus()
  }

  onPointerOut() {
    const responseType = "RESPONSE_MY_PROFILE";
    this.statusView.setActive(false).setVisible(false);
    socket.off(responseType, this.onResponse);
  }
}