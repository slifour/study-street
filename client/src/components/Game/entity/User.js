import Phaser from 'phaser';
import socket from '../../../socket';
import Status from './Status';

export default class User extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.stop = true
    this.socket = socket
    this.setCollideWorldBounds(true);
    this.initialize({name : 'User', group : 1, position : {x : this.x, y : this.y}}, this.scene)

    /* Status display */
    this.setInteractive();
    this.prepareStatusView();
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);
  }

  /** Socket emit methods */

  /** initialize : tell server to create this user */
  initialize(userData) {    
    this.socket.emit('initialize', userData);
  };

  /** sendPosition : tell server to move this user */
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  };

  /** Update methods */
  updateAnimation(state){
    this.play(state, true);    
  }

  updateMovement(cursors) {
    this.stop = true
    let state = ''

    // Stop
    this.setVelocity(0);
    // Move left
    if (cursors.left.isDown) {
      this.setVelocityX(-500);
      state = 'left'
    } 
    // Move right
    else if (cursors.right.isDown) {
      this.setVelocityX(500);
      state = 'right'
    }
    // Move up
    if (cursors.up.isDown) {
      this.setVelocityY(-500);
      if (state === ''){
        state = 'up'
      }      
    }
    // Move down
    else if (cursors.down.isDown) {
      this.setVelocityY(500);
      if (state === ''){
        state = 'down'
      }      
    }

    if (state !== ''){
      this.stop = false
    }
    // this.updateAnimation(state)
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  onPointerOver() {
    /* 플레이어를 호버할 때 status view를 보여주기 */
    const dummyUser = {
        "userID": "eunki",
        "userName": "은기",
        "status": "Making status",
    };

    this.statusView.text = dummyUser.status;
    this.statusView.setActive(true).setVisible(true);
  }

  onPointerOut() {
    this.statusView.setActive(false).setVisible(false);
  }

  update(cursors) {
    this.statusView.update();
    this.updateMovement(cursors);
    let positionData = {x : this.x, y : this.y};
    if (!this.stop){
      this.sendPosition(positionData);
    }
  }
}
