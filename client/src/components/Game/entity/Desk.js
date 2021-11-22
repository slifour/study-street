import Phaser from 'phaser';
import Chair from './Chair';

export default class Desk extends Phaser.GameObjects.Container {
  constructor(scene, x, y, deskKey, chairKey, index, interactive = true, n = 2) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.index = index;
    this.indexToChair = {};
    this.chairIndex = 0;
    this.group = {}    

    let margin = 10
    let desk = this.scene.physics.add.image(0, 0, deskKey).setScale(0.8);
    desk.setImmovable();

    // this.deskDepth = desk.depth; 
    this.setSize(desk.displayWidth, desk.displayHeight)

    this.chairY = - (desk.displayHeight/2 + margin)    
    this.createChairs(n, this.chairY, chairKey.up, 'up', interactive)

    this.add(desk);

    this.chairY = - this.chairY 
    this.createChairs(n, this.chairY, chairKey.down, 'down', interactive)
    
    console.log('New Desk:', x, y)
  }

  createChairs(n, chairY, chairKey, dir, interactive){
    let chairDistance = this.displayWidth/n 
    let chairX = chairDistance/2-this.displayWidth/2
    let i;
    let depthMargin = dir==='up'? -2: 2
    for (i=0; i < n; i++){
      let chair = new Chair(this.scene, chairX, chairY, chairKey, dir, this.chairIndex);      
      chair.setImmovable();
      this.add(chair);
      // chair.setDepth(this.deskDepth + depthMargin);
      this.indexToChair[this.chairIndex] = chair;
      this.chairIndex += 1;
      chair.init(this, interactive);
      chairX += chairDistance
    }
  }

  assignGroup(group){
    this.group = group
    Object.values(this.indexToChair).forEach( (chair) => {
      chair.setAllowed(false, group.groupName);
    })
  }

  setInteractive(setInteractive){
    if (!setInteractive) {
      
    }

  }
}
