import Phaser, { NONE } from 'phaser';

export default class Book extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, quest, alert, spriteKey = 'book-side', color="#ff0000", unitSize = 8, id = 0) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.quest = quest;
    this.size = quest.doneUsers.length;
    this.color = color;
    this.unitSize = unitSize;
    this.relativeX = 0;
    this.y = y;
    this.setOrigin(0,1)
    this.resetScale();
    // this.width = this.displayWidth;
    // this.height = this.displayHeight;
    this.setInteractive();
    this.setHover();
  }

  setAlert(alert){
    this.alert = alert;
  }

  resetScale(){
    this.setScale(this.size/2, 0.5)
  }

  setHover(){
    this.on('pointerover', this.onPointerOver, this); 
    this.on('pointerout', this.onPointerout, this); 
  }

  setClick(){
    this.on('pointerdown', this.onPointerDown, this); 
  }

  onPointerDown(){
    console.log("onPointerDown()")
    this.setScale(this.size/1.5, 0.6)
    if (this.alert !== undefined){
      this.alert.setPosition(this.alert.x + this.displayWidth*(this.size/1.5-this.size/2), this.alert.y - this.displayHeight*0.1)
    }
  }

  onPointerOver(){
    console.log("onPointerOver()")
    this.setScale(this.size/1.5, 0.6)
    if (this.alert !== undefined){
      this.alert.setPosition(this.alert.x + this.displayWidth*(this.size/1.5-this.size/2), this.alert.y - this.displayHeight*0.1)
    }
  }  

  onPointerout(){
    this.resetScale()
    if (this.alert !== undefined){
      Phaser.Display.Align.To.TopCenter(this.alert, this, 0);
    }
  }

  init(){
    this.scene.input.on('pointerdown', function(){
   }, this);
  }

  stopTween() {
    this.tween.stop();
    this.tweenAlert.stop();
  };

  startTween() {
    this.tween = this.scene.tweens.add({
      targets: this,
      scaleX: '+=.15',
      scaleY: '+=.15',
      duration: 1500,
      ease: 'Sine.easeInOut',
      delay: 1000,
      yoyo: true,
      repeat: -1           
    }) 
    this.tweenAlert = this.scene.tweens.add({
      targets: this.alert,
      x: this.alert.x + this.displayWidth*(this.size/1.5-this.size/2),
      y: this.alert.y - this.displayHeight*0.1,
      duration: 1500,
      ease: 'Sine.easeInOut',
      delay: 1000,
      yoyo: true,
      repeat: -1           
    }) 
}

    /** Update methods */
  /** @param {string} state  */
//   updateAnimation(state){
//       state = 'book-turn'
//     this.play(state, true);    
//   }

}