import Phaser, { GameObjects } from "phaser";
import uniqueString from 'unique-string';
import socket from '../../../socket';
import { getParsedDuration } from '../utils/Time';
import Status from './Status';

export default class Friend extends GameObjects.Container{
  constructor(scene, position,  spriteKey, animSuffix, loginUser) {
    super(scene, position.x, position.y);
    this.scene = scene;
    this.userID = loginUser.userID
    this.userName = loginUser.userName;
    console.log("Log. Friend() userName=", this.userName)
    this.scene.add.existing(this);
    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
    this.velocity = 200;

    this.sprite = new FriendSprite(scene, 0, 0, spriteKey, animSuffix);

    this.namePadding = -10;
    this.name = this.scene.add.text(0, -(this.sprite.height/2 + this.namePadding), this.userName, { 
      fontSize: '14px', 
      fontFamily: 'Lato',
      color: '#ffffff',
      backgroundColor : '#000000', 
      align:'center', 
      });
    this.name.setOrigin(0.5);

    this.add(this.sprite);
    this.add(this.name);
    this.width = this.sprite.displayWidth;
    this.height = this.sprite.displayHeight;
    
    // console.log('Friend :', this.width, this.height)
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

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  showStatus() {
    console.log("PointOver")
    /* 플레이어를 호버할 때 status view를 보여주기 */

    // TODO: 씬에 들어온 다른 플레이어의 ID를 가져오기

    const requestType = "REQUEST_MY_PROFILE";
    const responseType = "RESPONSE_MY_PROFILE";
    this.requestKey = uniqueString();

    this.onResponseOK = ({payload}) => {
      console.log("OK: ", payload);
      this.statusView.text = `${getParsedDuration(payload.todayStudyTime)}`;
      this.statusView.update();
    };
    
    this.onResponseFail = ({payload}) => {
      console.warn("Phaser: ", payload.msg || "Failed to load friend's profile");
    };
    
    this.onResponse = ({responseType, requestKey, status, payload}) => {
      if (requestKey === this.requestKey) {
        console.log("Phaser request: got response ", {responseType, requestKey, status, payload});
        switch (status) {
          case "STATUS_OK": 
            this.onResponseOK && this.onResponseOK({requestKey, status, payload});
          break;
          case "STATUS_FAIL":
            this.onResponseFail && this.onResponseFail({requestKey, status, payload});
            break;
        }
      }
    }

    socket.on(responseType, this.onResponse);

    socket.emit(requestType, {
      requestUser: this.scene.game.registry.get("loginUser").userID,
      requestKey: this.requestKey,
      requestType,
      payload: { userID: this.userID }
    });
    this.statusView.setActive(true).setVisible(true);
  }

  onPointerOver() {
    this.showStatus()
  }

  onPointerOut() {
    const responseType = "RESPONSE_MY_PROFILE";
    this.statusView.setActive(false).setVisible(false);
    socket.off(responseType, this.onResponse);
  }

  updateMovement(x, y) {
    console.log("Friend.updateMovement()", x, y)

    this.stop = true;
    let animState = this.animName.idle;

    // Move left
    if (this.x > x) {
      animState = this.animName.left;
      this.stop = false;
    } 
    // Move right
    else if (this.x < x) {
      animState = this.animName.right;
      this.stop = false;
    }
    // Move up
    if (this.y < y) {
      animState = this.animName.up;
      this.stop = false;
    }
    // Move down
    else if (this.y > y) {
      animState = this.animName.down;
      this.stop = false;
    }

    this.sprite.updateAnimation(animState)
    
    // this.setPosition(x, y);
    let duration = Phaser.Math.Distance.Between(this.x, this.y, x, y) / this.velocity;
    let moveTween = this.scene.tweens.add({
      targets : this,
      x : x,
      y: y,
      ease : 'Linear',
      duration: duration,
      repeat : 0,
    })
  }

  sit(desk, chairIndex){
    let indexer = 1;
    let depthMargin = 1;
    let marginX = -5;
    let marginY = 0;
    let frame = 0;    
    this.chair = desk.indexToChair[chairIndex];
    if (this.chair.dir === 'down'){
      indexer = 0;
      marginY = -10;
      frame = 11;
    }
    this.chair.setInteractions(false);

    this.setPosition(this.chair.x + marginX, this.chair.y + marginY);

    this.showStatus();
    this.setInteractions(false);
    desk.addAt(this, desk.getIndex(this.chair) + indexer)
    desk.addAt(this.statusView, desk.getIndex(this.chair) + indexer)
    // this.setDepth(desk.deskDepth+depthMargin)
    this.sprite.setFrame(frame);

    console.log("sit", desk, this.chair);
  }

  stand(){
    this.chair.setInteractions(true);
    this.chair = null;
    this.statusView.destroy();
  }

  update(){
    this.statusView.update();
  }
} 

class FriendSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix, id) {
    super(scene, x, y, spriteKey);
    this.velocity = 200;
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id;
    // this.setCollideWorldBounds(true);

    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
  }

  updateAnimation(state){
    this.play(state, true);    
  }
}