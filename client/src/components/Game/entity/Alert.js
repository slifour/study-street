import Phaser, { GameObjects } from "phaser";
import Tooltip from "./Tooltip";

export default class Alert extends GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Components.Transform} hostObject
   * @param {string} text
   */
  constructor(scene, hostObject, text) {
    super(scene);
    this.scene = scene;
    this.host = hostObject;
    this.text = text;
    this.paddingX = 5;
    this.paddingY = 10;

    this.prevState = {
      x: this.host.x,
      y: this.host.y,
      text: this.text
    };
    
    this.textView = this.scene.add.text(0, 0, text, { 
      fontSize: '16px', 
      fontFamily: 'Lato',
      color: '#000000', });

    this.graphics = this.scene.add.graphics();
    this.graphics.fillStyle(0xffffff);
  
    const width = this.textView.width + 2 * this.paddingX;
    const height = this.textView.height + 2 * this.paddingY;
    const roundRadius = height / 5;
    this.graphics.fillRoundedRect(
      this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
      width, height, roundRadius);

    this.scene.add.existing(this);
    this.add(this.graphics);
    this.add(this.textView);
    this.setSize(width, height)
    this.setInteractive();
    this.setClick();
    
  }

  setBook(book){
    this.book = book;
  }

  setClick(){
    this.on('pointerdown', this.onPointerDown, this); 
  }

  onPointerDown(){
    console.log('pointerdown')
    let tooltip = new Tooltip(this.scene, 0, 0, 'newArtifact');
    this.scene.time.addEvent({
        delay: 3000,
        callback: ()=>{
          tooltip.onArtifactTooltipClicked(this.nextBookPosition)
          this.book.stopTween()
          this.destroy();
        },
        loop: false
    })    
  }
}