import Phaser, { GameObjects } from "phaser";

export default class TooltipStatic extends GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Components.Transform} hostObject
   * @param {string} text
   */
  constructor(scene, x, y, text) {
    super(scene, x, y);
    this.scene = scene;
    this.text = text;

    this.paddingX = 20;
    this.paddingY = 10;
    this.marginY = 55;
    
    this.textView = this.scene.add.text(0, 0, text, { 
      fontSize: '16px', 
      fontFamily: 'Lato',
      color: '#dddddd', });

    this.graphics = this.scene.add.graphics().fillStyle(0x232323, 0.6);      
    this.add(this.graphics);
    this.add(this.textView);

    this.setDepth(50);
  }
  
  update(text) { 
    if (!this.active) return;
    this.textView.text = text;

    this.graphics.clear();
    this.graphics.fillStyle(0x232323, 0.6);

    const width = this.textView.width + 2 * this.paddingX;
    const height = this.textView.height + 2 * this.paddingY;
    const roundRadius = height / 2;
    this.graphics.fillRoundedRect(
      this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
      width, height, roundRadius);
  }
}