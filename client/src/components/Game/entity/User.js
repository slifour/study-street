import Phaser from 'phaser';
import socket from '../../../socket';
import Status from './Status';
import Name from './Name';
import Request from '../request'
import UserContainer from './UserContainer';
/**
 * Reference
 * https://stackoverflow.com/questions/66616153/pathfinding-animation-in-phaser * 
 */


export default class User extends UserContainer {
  constructor(scene, x, y, spriteKey, animSuffix, loginUser, sizeFactor ) {
    super(scene, {x:x, y:y},  spriteKey, animSuffix, loginUser, sizeFactor, "Click to set status");
    this.registry = this.scene.game.registry;
    this.stop = true
    this.socket = socket    
    this.setInteractive();
    this.setInteractions();
    this.status.setInteractive();
    this.status.setInteractions();
  }

  // init(){
  //   // this.setCollideWorldBounds(true);
  //   // this.initialize({currentScene : this.scene.key});
  //   // this.initialize({prevScene : this.scene.prevScene, currentScene : this.scene.key});
  //   /* Status display */
  //   this.setInteractive();
  //   this.prepareStatusView();
  //   // this.prepareName();
  //   this.on('pointerover', this.onPointerOver);
  //   this.on('pointerout', this.onPointerOut);
    
  // }

  /** initialize : tell server to create this user */
  initialize(payload) {    
    console.log('initialize :', payload)
    let request = new Request(this.socket, this.loginUser)
    request.request("REQUEST_CHANGE_SCENE", payload);
    // request(requestType, responseType, makePayload, onRequest, onResponseOK, onResponseFail, socket)
  };

  /** sendPosition : tell server to move this user */
  requestMove(positionData) {
    this.socket.emit('REQUEST_MOVE', positionData);
  };

  /** @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors */
  updateMovement(cursors) {
    this.stop = true
    let animState = this.animName.idle;

    // Stop
    this.body.setVelocity(0);
    // Move left
    if (cursors.left.isDown) {
      this.body.setVelocityX(-200);
      animState = this.animName.left;
      this.stop = false;
    } 
    // Move right
    else if (cursors.right.isDown) {
      this.body.setVelocityX(200);
      animState = this.animName.right;
      this.stop = false;
    }
    // Move up
    if (cursors.up.isDown) {
      this.body.setVelocityY(-200);
      animState = this.animName.up;
      this.stop = false;
    }
    // Move down
    else if (cursors.down.isDown) {
      this.body.setVelocityY(200);
      animState = this.animName.down;
      this.stop = false;
    }

    this.sprite.updateAnimation(animState)
  }

  // showStatus() {
  //   /* 플레이어를 호버할 때 status view를 보여주기 */
  //   const loginUser = this.registry.get("loginUser");
  //   if (loginUser) {
  //     this.statusView.text = loginUser.status;
  //   } else {
  //     this.statusView.text = "Please login first.";
  //   }
  //   super.showStatus();
  //   // this.statusView.setActive(true).setVisible(true);
  //   // this.statusView.setInteractive();
  //   // this.statusView.setInteractions();
  // }

  /** @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors */
  update(cursors) {
    // super.update();
    this.updateMovement(cursors);
    let positionData = {x : this.x, y : this.y};
    if (!this.stop){
      this.requestMove(positionData);
    }
  }
}

  /** Socket emit methods */
  // request(requestType, responseType, makePayload, onRequest, onResponseOK, onResponseFail, socket) {

  //   usedRequestKeyRef.current = uniqueString();
    
  //   socket.emit(requestType, {
  //     requestUser: loginUser.userID,
  //     requestKey: usedRequestKeyRef.current,
  //     requestType,
  //     payload: makePayload ? makePayload() : {}
  //   });

  //   socket.on(responseType, onResponse);    
  // }

  // onresponse(requestKey, status, payload) {
  //   if (requestKey === usedRequestKeyRef.current) {
  //     switch (status) {
  //       case "STATUS_OK": 
  //         onResponseOK && onResponseOK({requestKey, status, payload});
  //         break;
  //       case "STATUS_FAIL":
  //         onResponseFail && onResponseFail({requestKey, status, payload});
  //         break;
  //     }
  //   }
  // }
