import Phaser from 'phaser';
import socket from '../../socketConfig';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.stop = true
    this.socket = socket
    this.initialize({name : 'Player', group : 1, position : {x : this.x, y : this.y}})
  }

  /** Socket emit methods */

  /** initialize : tell server to create this player */
  initialize(playerData) {    
    this.socket.emit('initialize', playerData);
  };

  /** sendPosition : tell server to move this player */
  sendPosition(positionData) {
    this.socket.emit('positionUpdate', positionData);
  };


  /** Update methods */
  updateAnimation(state){
    this.play(state, true);    
  }

  updateMovement(cursors) {
    let state = ''

    // Stop
    this.setVelocity(0);
    // Move left
    if (cursors.left.isDown) {
      this.setVelocityX(-360);
      state = 'left'
    } 
    // Move right
    else if (cursors.right.isDown) {
      this.setVelocityX(360);
      state = 'right'
    }
    // Move up
    if (cursors.up.isDown) {
      this.setVelocityY(-360);
      state = 'up'
    }
    // Move down
    else if (cursors.down.isDown) {
      this.setVelocityY(360);
      state = 'down'
    }

    if (state !== ''){
      this.stop = true
    }
    else{
      this.stop = false
    }

    // this.updateAnimation(state)
  }

  update(cursors) {
    this.updateMovement(cursors);
    let positionData = {x : this.x, y : this.y}
    if (!this.stop){
      this.sendPosition(positionData)
    }
  }
}
