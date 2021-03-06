import Phaser, { GameObjects } from "phaser";

export default class Name extends GameObjects.Container {
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

    this.paddingX = 20;
    this.paddingY = 10;
    this.marginY = 55;

    this.prevState = {
      x: 0,
      y: 0,
      text: this.text
    };
    
    this.textView = this.scene.add.text(0, 0, text, { 
      fontSize: '12px', 
      fontFamily: 'Lato',
      color: '#dddddd', });
    this.graphics = this.scene.add.graphics();
    
    this.add(this.graphics);
    this.add(this.textView);

    this.graphics.fillStyle(0x232323, 0.6);
  
    const width = this.textView.width + 2 * this.paddingX;
    const height = this.textView.height + 2 * this.paddingY;
    const roundRadius = height / 2;
    this.graphics.fillRoundedRect(
      this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
      width, height, roundRadius);

    this.update()

  }

  update() { 
    if (
      this.prevState.x !== this.host.x ||
      this.prevState.y !== this.host.y ||
      this.prevState.text !== this.text
    ) {
      console.log("update status view");
      this.textView.text = this.text;
      this.x = this.host.x - 0.5 * this.textView.width;
      this.y = this.host.y - 0.5 * this.textView.height - this.marginY;

      this.prevState = {
        x: this.host.x,
        y: this.host.y,
        text: this.text
      };
    }
  }
}