import Phaser from 'phaser';
import Chair from './Chair';

export default class Desk extends Phaser.GameObjects.Container {
  constructor(scene, x, y, deskKey, chairKey, interactive = true, n = 2, id = 0) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    let margin = 10
    let desk = this.scene.physics.add.image(0, 0, deskKey).setScale(0.8);
    desk.setImmovable();

    this.setSize(desk.displayWidth, desk.displayHeight)

    this.chairY = - (desk.displayHeight/2 + margin)    
    this.createChairs(n, this.chairY, chairKey.up, 'up', interactive)

    this.add(desk)
    
    this.chairY = - this.chairY 
    this.createChairs(n, this.chairY, chairKey.down, 'down', interactive)

    this.id = id
    
    console.log('New Desk:', x, y)
  }

  createChairs(n, chairY, chairKey, dir, interactive){
    let chairDistance = this.displayWidth/n 
    let chairX = chairDistance/2-this.displayWidth/2
    let i;
    for (i=0; i < n; i++){
      let chair = new Chair(this.scene, chairX, chairY, chairKey, dir);
      chair.setImmovable();
      this.add(chair);
      chair.init(this, interactive);
      chairX += chairDistance
    }
  }

  setInteractive(setInteractive){
    if (!setInteractive) {
      
    }

  }
}
