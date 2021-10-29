import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

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

    this.updateAnimation(state)
  }

  update(cursors) {
    this.updateMovement(cursors);
  }
}
