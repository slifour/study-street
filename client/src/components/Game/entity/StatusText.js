import Phaser, { GameObjects } from "phaser";
import { getParsedDuration } from '../utils/Time';

export default class StatusText extends GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {Phaser.GameObjects.Components.Transform} hostObject
   * @param {string} text
   */
  constructor(scene, x, y, text, todayStudyTime = null, style = { 
    fontSize: '16px', 
    fontFamily: 'Lato',
    color: '#dddddd',
    // align:'center', 
    }){
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);  
    this.pointerOutFlag = 0;
    this.paddingX = 20;
    this.paddingY = 10;
    this.marginY = 55;
    this.statusText = text
    this.todayStudyTime = todayStudyTime
    this.createGraphics();
    this.createText(text, style);
    this.update(text, todayStudyTime);
  }

  createText(text, style){
    this.textView = this.scene.add.text(0, 0, text, style).setOrigin(0.5);
    this.y = - 0.75 * this.textView.height - this.marginY;    
    this.add(this.textView);    
  }

  createGraphics(){
    this.graphics = this.scene.add.graphics().fillStyle(0x343434, 0.6);  
    this.add(this.graphics);    
  }

  update(text, todayStudyTime = null) { 
    let todayStudyTimeString = todayStudyTime === null ? "" : getParsedDuration(todayStudyTime);
    // if (!this.active) return;

    // if (
    //   this.prevState.x !== this.host.x ||
    //   this.prevState.y !== this.host.y ||
    //   this.prevState.text !== this.text
    // ) {
    //   console.log("update status view");
    //   this.textView.text = this.text;
    //   this.textView.x = this.host.x - 0.5 * this.textView.width;
    //   this.textView.y = this.host.y - 0.75 * this.textView.height - this.marginY;
    this.statusText = text
    this.textView.text = todayStudyTimeString + " " + text
    this.graphics.clear();
    const width = this.textView.width + 2 * this.paddingX;
    const height = this.textView.height + 2 * this.paddingY;
    const roundRadius = height / 2;
    this.graphics.fillRoundedRect(
      -this.textView.width/2 - this.paddingX, -this.textView.height/2 - this.paddingY, 
      width, height, roundRadius);
    this.setSize(width, height);
    //   this.graphics.fillStyle(0x232323, 0.6);
  
    //   const width = this.textView.width + 2 * this.paddingX;
    //   const height = this.textView.height + 2 * this.paddingY;
    //   const roundRadius = height / 2;
    //   this.graphics.fillRoundedRect(
    //     this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
    //     width, height, roundRadius);

    //   this.prevState = {
    //     x: this.host.x,
    //     y: this.host.y,
    //     text: this.text
    //   };
    //   this.setSize(width, height);
    //   this.setInteractive(false);
    //   this.setInteractive(true);  
    //   this.setInteractions();       

    //   // this.tiemerEvent = this.scene.time.addEvent({
    //   //   delay : 1000,
    //   //   callback : this.updateTime(),
    //   //   loop: true,
    //   // });


    // }
  }

  setInteractions(setInteractionsbool = true){
    this.removeAllListeners();
    if(setInteractionsbool){
      // this.on('pointerover', this.onPointerOver); 
      // this.on('pointerout', this.onPointerOut); 
      this.on('pointerdown', this.onPointerDown); 
    }
  }

  onPointerOver() {
    this.setScale(1.2)
  }

  onPointerOut() {
    this.setScale(1)
    // const responseType = "RESPONSE_MY_PROFILE";
    this.pointerOutFlag += 1;
    this.scene.time.addEvent({
      callback : this.closeStatus,
      callbackScope: this,
      delay : 3000
    })

    // socket.off(responseType, this.onResponse);
  }

  showStatus() {    
    this.setVisible(true);
    // this.update();
    console.log("Status / showStauts", this.active, this.visible, this.listeners('pointerdown'))
  }

  closeStatus() {
    this.pointerOutFlag -= 1;
    if (this.pointerOutFlag === 0){
      this.setActive(false).setVisible(false);
    }
  }

  onPointerDown() {
    console.log('Status / onPointerDown()')
    this.scene.game.events.emit("EVENT_INPUT_STATUS");
  }

  // let tooltip = this.add.dom(screenCenterX, screenCenterY);             
  // tooltip.createFromCache('newArtifact');updateBooks

  updateTime() {
    let elapsedTime = this.tiemerEvent.getRepeatCount()*1000;
    this.textView.text = getParsedDuration(elapsedTime);
  }

}