import Phaser, { GameObjects } from "phaser";
import { getParsedDuration } from '../utils/Time';

export default class Status extends GameObjects.Container {
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
    this.pointerOutFlag = 0;

    this.paddingX = 20;
    this.paddingY = 10;
    this.marginY = 55;

    this.prevState = {
      x: this.host.x,
      y: this.host.y,
      text: this.text
    };
    
    this.textView = this.scene.add.text(this.host.x, this.host.y, text, { 
      fontSize: '16px', 
      fontFamily: 'Lato',
      color: '#dddddd', });
    this.graphics = this.scene.add.graphics();
    
    this.add(this.graphics);
    this.add(this.textView);

    this.setDepth(50);
  }

  update() { 
    if (!this.active) return;

    if (
      this.prevState.x !== this.host.x ||
      this.prevState.y !== this.host.y ||
      this.prevState.text !== this.text
    ) {
      console.log("update status view");
      this.textView.text = this.text;
      this.textView.x = this.host.x - 0.5 * this.textView.width;
      this.textView.y = this.host.y - 0.75 * this.textView.height - this.marginY;
  
      this.graphics.clear();
      this.graphics.fillStyle(0x232323, 0.6);
  
      const width = this.textView.width + 2 * this.paddingX;
      const height = this.textView.height + 2 * this.paddingY;
      const roundRadius = height / 2;
      this.graphics.fillRoundedRect(
        this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
        width, height, roundRadius);

      this.prevState = {
        x: this.host.x,
        y: this.host.y,
        text: this.text
      };

      // this.tiemerEvent = this.scene.time.addEvent({
      //   delay : 1000,
      //   callback : this.updateTime(),
      //   loop: true,
      // });

    }
  }

  onPointerOver() {
    this.host.setPosition.pointerOnStatus = true; 
  }

  onPointerOut() {
    // const responseType = "RESPONSE_MY_PROFILE";
    this.pointerOutFlag += 1;
    this.scene.time.addEvent({
      callback : this.closeSatus,
      callbackScope: this,
      delay : 3000
    })

    // socket.off(responseType, this.onResponse);
  }

  closeSatus() {
    this.pointerOutFlag -= 1;
    if (this.pointerOutFlag === 0){
      this.setActive(false).setVisible(false);
      this.host.setPosition.pointerOnStatus = true;
    }
  }

  onPointerDown() {
    this.game.events.emit("EVENT_INPUT_STATUS");
  }

  // let tooltip = this.add.dom(screenCenterX, screenCenterY);             
  // tooltip.createFromCache('newArtifact');updateBooks

  updateTime() {
    let elapsedTime = this.tiemerEvent.getRepeatCount()*1000;
    this.textView.text = getParsedDuration(elapsedTime);
  }

}