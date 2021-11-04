import Phaser from 'phaser';

export default class Chair extends Phaser.Physics.Arcade.Sprite {
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

}

