import Phaser from 'phaser';
import socket from '../../../socket';
import Status from './Status';
import Name from './Name';
import request from '../request'
/**
 * Reference
 * https://stackoverflow.com/questions/66616153/pathfinding-animation-in-phaser * 
 */

export default class User extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.registry = this.scene.game.registry;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.stop = true
    this.socket = socket
    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    }
  }

  init(){
    // this.setCollideWorldBounds(true);
    // this.initialize({currentScene : this.scene.key});
    this.initialize({prevScene : this.scene.prevScene, currentScene : this.scene.key});
    /* Status display */
    this.setInteractive();
    this.prepareStatusView();
    // this.prepareName();
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);
  }

  /** initialize : tell server to create this user */
  initialize(payload) {    
    console.log('initialize :', payload)
    request.request("REQUEST_CHANGE_SCENE", "RESPONSE_CHANGE_SCENE", payload)

    // request(requestType, responseType, makePayload, onRequest, onResponseOK, onResponseFail, socket)

  };

  /** sendPosition : tell server to move this user */
  requestMove(positionData) {
    this.socket.emit('REQUEST_MOVE', positionData);
  };

  /** Update methods */
  /** @param {string} state  */
  updateAnimation(state){
    this.play(state, true);    
  }

  /** @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors */
  updateMovement(cursors) {
    this.stop = true
    let animState = this.animName.idle;

    // Stop
    this.setVelocity(0);
    // Move left
    if (cursors.left.isDown) {
      this.setVelocityX(-200);
      animState = this.animName.left;
      this.stop = false;
    } 
    // Move right
    else if (cursors.right.isDown) {
      this.setVelocityX(200);
      animState = this.animName.right;
      this.stop = false;
    }
    // Move up
    if (cursors.up.isDown) {
      this.setVelocityY(-200);
      animState = this.animName.up;
      this.stop = false;
    }
    // Move down
    else if (cursors.down.isDown) {
      this.setVelocityY(200);
      animState = this.animName.down;
      this.stop = false;
    }

    this.updateAnimation(animState)
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  prepareName() {
    const initialtext = "Name";
    this.nameView = new Name(this.scene, this, initialtext);
    this.scene.add.existing(this.nameView);
  }

  onPointerOver() {
    /* 플레이어를 호버할 때 status view를 보여주기 */
    const loginUser = this.registry.get("loginUser");
    if (loginUser) {
      this.statusView.text = loginUser.status;
    } else {
      this.statusView.text = "Please login first.";
    }
    this.statusView.setActive(true).setVisible(true);
  }

  onPointerOut() {
    this.statusView.setActive(false).setVisible(false);
  }

  /** @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors */
  update(cursors) {
    this.statusView.update();
    // this.nameView.update();
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
