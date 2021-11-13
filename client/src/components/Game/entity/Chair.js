

import Phaser from 'phaser';

export default class Chair extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, dir, id = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id
    this.dir = dir;    
    this.gap = 50;
    console.log('New Chair:', x, y)
  }

  init(desk, interactive){
    if (interactive){
      this.setInteractive();
    }
    this.desk = desk;    
    this.setClick();
    this.setHover();    
  }

  getAbsolutePosition(containerX, containerY){
    this.absolutePosition = { x : containerX + this.x, y : containerY + this.y};
  }

  setHover(){
    this.on('pointerover', this.onPointerOver, this); 
    this.on('pointerout', this.onPointerout, this); 
  }

  setClick(){
    this.on('pointerdown', this.onPointerDown, this); 
  }

  sit(){
    let indexer = 1;
    let margin = 0;
    if (this.dir === 'down'){
      indexer = 0;
      margin = -10;
    }
    this.scene.user.setPosition(this.x, this.y + margin);
    this.index = this.desk.getIndex(this)
    this.desk.addAt(this.scene.user, this.index + indexer)
    console.log("sit", this.desk, this.scene.user);
  }

  onPointerDown(){
    console.log("onPointerDown()")
    if (this.scene.user === undefined) {
      console.log('user undefined')
      return;  
    }    
    this.sit();
    this.scene.changeScene('Study', this.index)
    // this.scene.cameras.main.pan(this.desk.x + this.x + this.scene.cameras.main.width/2 - this.gap, this.desk.y, 5000, Phaser.Math.Easing.Sine.in);
    // const timeout = setTimeout(() => this.scene.changeScene('Study'), 2000);
    
    // this.scene.user.setPosition(this.desk.x + this.x, this.desk.y + this.y);
    // const depthIndices = {'up' : -1, 'down' : 1};
    // const depthIndex = depthIndices[this.dir];
    // this.scene.user.setDepth(depthIndex);
    
    // this.setDepth(2*depthIndex); 
    // console.log(this.scene.user.depth);
    // console.log(this.depth);
    // this.scene.game.events.emit("confirmToStudy");
    // this.scene.physics.moveToObject(this.scene.user, this, 30);  
    // this.scene.user.setPosition(this.x, this.y);
    // this.desk.add(this.scene.user);
    // this.scene.cameras.main.fadeOut(500, 0, 0, 0);
    // this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
    //     // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
    //     // this.doUpdate = false
    //     // this.scene.start('Study');
    // })  
  }

  onPointerOver(){
    console.log("onPointerOver()")
    this.setScale(1.2)
    // if (this.alert !== undefined){
    //   this.alert.setPosition(this.alert.x + this.displayWidth*(this.size/1.5-this.size/2), this.alert.y - this.displayHeight*0.1)
    // }
  }  

  onPointerout(){
    this.resetScale()
    // if (this.alert !== undefined){
    //   Phaser.Display.Align.To.TopCenter(this.alert, this, 0);
    // }
  }

  resetScale(){
    this.setScale(1)
  }

  handleClickChair(){    

  }
}