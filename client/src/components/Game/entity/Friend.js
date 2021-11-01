import Phaser from 'phaser';

export default class Friend extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, id) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id
  }

  setId(id){
    this.id = id
  }

  updateAnimation(state){
    this.play(state, true);    
  }

  updateMovement(position) {
    this.setPosition(position.x, position.y)
  }

  update() {
    // this.updateMovement(position);
  }
}
