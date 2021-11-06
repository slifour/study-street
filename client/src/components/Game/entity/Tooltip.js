import Phaser from 'phaser';
import Book from './Book';

export default class Tooltip extends Phaser.GameObjects.Container {
  constructor(scene, x, y, bookKey, htmlKey, id=0) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.fixedToCamera = true;

    this.tooltip = this.scene.add.dom(0, 0);
    this.tooltip.createFromCache(htmlKey);
    this.add(this.tooltip);       
    this.book = new Book(this.scene, x, y, 'book-front').setScale(0.5);
  }

  onArtifactTooltipClicked(nextBookPotision){    
    this.tooltip.destroy()
    this.scene.cameras.main.startFollow(this.book);
    this.scene.physics.moveTo(this.book,  nextBookPotision.x,  nextBookPotision.y, 200);
    this.scene.time.addEvent({
      delay: 1000,
      callback: ()=>{
        this.scene.cameras.main.startFollow(this.user);
      },
      loop: false
    })
    this.scene.nextBookIndex += 1;
  }
}
