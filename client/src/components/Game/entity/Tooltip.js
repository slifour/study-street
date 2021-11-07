import Phaser from 'phaser';

export default class Tooltip extends Phaser.GameObjects.Container {
  constructor(scene, x, y, htmlKey, id=0) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.fixedToCamera = true;

    this.tooltip = this.scene.add.dom(0, 0);
    this.tooltip.createFromCache(htmlKey);
    this.add(this.tooltip);       
    let newX = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
    let newY = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
    this.setPosition(newX, newY)
  }

  onArtifactTooltipClicked(nextBookPotision = {x:4000, y:2200}){    
    this.tooltip.destroy()
    // this.scene.cameras.main.startFollow(this.book);
    // this.scene.physics.moveTo(this.book,  nextBookPotision.x,  nextBookPotision.y, 200);
    // this.scene.time.addEvent({
    //   delay: 1000,
    //   callback: ()=>{
    //     this.scene.cameras.main.startFollow(this.user);
    //   },
    //   loop: false
    // })
    // this.scene.nextBookIndex += 1;
  }
}
