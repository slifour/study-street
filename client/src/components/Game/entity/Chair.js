

import Phaser from 'phaser';
import TooltipStatic from './TooltipStatic';

export default class Chair extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, dir, id = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id;
    this.dir = dir;    
    this.gap = 50;
    this.allowed = true;
    console.log('New Chair:', x, y);
  }

  init(desk, interactive = true){    
    this.desk = desk;        
    console.log('init(chiar):', this.x, this.desk.x, this.y, this.desk.y);
    this.tooltip = new TooltipStatic(this.scene, this.x+this.desk.x, this.y+this.desk.y, "");    
    this.scene.add.existing(this.tooltip);
    this.scene.physics.world.enable(this.tooltip);
    console.log('init(chiar):', this.tooltip.x, this.tooltip.y);
    if(!interactive){
      return;
    }
    this.setInteractive();
    this.setInteractions();    
  }

  setInteractions(){
    this.on('pointerover', this.onPointerOver, this); 
    this.on('pointerout', this.onPointerout, this); 
    this.on('pointerdown', this.onPointerDown, this); 
  }

  sit(){
    let indexer = 1;
    let marginX = -5;
    let marginY = 0;
    let frame = 0;
    if (this.dir === 'down'){
      indexer = 0;
      marginY = -10;
    }
    this.scene.user.setPosition(this.x+marginX, this.y + marginY);
    this.scene.user.setFrame(11);
    this.index = this.desk.getIndex(this)
    this.desk.addAt(this.scene.user, this.index + indexer)
    console.log("sit", this.desk, this.scene.user);
  }

  onPointerDown(){
    if(!this.allowed){
      return;
    }
    if (this.scene.user === undefined) {
      return;  
    }    
    this.sit();
    this.scene.changeScene('Study', this.index)
  }

  onPointerOver(){
    let text = "";
    if(this.allowed){
      this.setScale(1.2);
      text = "Click to Start Study.";
    }
    else{
      text= "Allowed only for groupName";
    }
    console.log(text);
    this.tooltip.update(text);
    this.tooltip.setActive(true).setVisible(true);

    console.log(this.tooltip.active, this.tooltip.visible)
    // if (this.alert !== undefined){
    //   this.alert.setPosition(this.alert.x + this.displayWidth*(this.size/1.5-this.size/2), this.alert.y - this.displayHeight*0.1)
    // }
  }  

  onPointerout(){
    this.resetScale();
    this.tooltip.setVisible(false);
    // if (this.alert !== undefined){
    //   Phaser.Display.Align.To.TopCenter(this.alert, this, 0);
    // }
  }

  // onPointOverNotAllowed(){
  //   const textNotAllowed = "Allowed only for groupName";
  //   const tooltip = new Tooltip(this.scene, this, textNotAllowed);
  // }

  resetScale(){
    this.setScale(1);
  }
}



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

    // getAbsolutePosition(containerX, containerY){
    //   this.absolutePosition = { x : containerX + this.x, y : containerY + this.y};
    // }