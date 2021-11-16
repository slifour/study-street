import Phaser, { GameObjects } from "phaser";
import Status from './Status';

export default class Friend extends GameObjects.Container{
  constructor(scene, x, y,  spriteKey, animSuffix, id) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };
    this.velocity = 200;

    this.namePadding = -10;
    this.avatar = new FriendSprite(scene, 0, 0, spriteKey, animSuffix, id)
    this.name = this.scene.add.text(0, -(this.avatar.height/2 + this.namePadding), id, { 
      fontSize: '10px', 
      fontFamily: 'Lato',
      color: '#dddddd',
      align:'center', });
    this.name.setOrigin(0.5);

    this.add(this.avatar);
    this.add(this.name);
    this.width = this.avatar.displayWidth;
    this.height = this.avatar.displayHeight;
    console.log('Friend :', this.width, this.height)
  }

  init(){
    this.prepareStatusView();
    /* Status display */
    this.setInteractive();
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);   
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  onPointerOver() {
    /* 플레이어를 호버할 때 status view를 보여주기 */
    const dummyUser = {
        "userID": "hyeon",
        "userName": "현",
        "status": "Developing objects in virtual space",
    };
    this.statusView.text = dummyUser.status;
    this.statusView.setActive(true).setVisible(true);
    this.statusView.update();
  }

  onPointerOut() {
    this.statusView.setActive(false).setVisible(false);
  }

  updateMovement(x, y) {
    console.log("Friend.updateMovement()", x, y)

    this.stop = true;
    let animState = this.animName.idle;

    // Move left
    if (this.x > x) {
      animState = this.animName.left;
      this.stop = false;
    } 
    // Move right
    else if (this.x < x) {
      animState = this.animName.right;
      this.stop = false;
    }
    // Move up
    if (this.y < y) {
      animState = this.animName.up;
      this.stop = false;
    }
    // Move down
    else if (this.y > y) {
      animState = this.animName.down;
      this.stop = false;
    }

    this.avatar.updateAnimation(animState)
    
    // this.setPosition(x, y);
    let duration = Phaser.Math.Distance.Between(this.x, this.y, x, y) / this.velocity;
    let moveTween = this.scene.tweens.add({
      targets : this,
      x : x,
      y: y,
      ease : 'Linear',
      duration: duration,
      repeat : 0,
    })
  }

  update(){
    this.statusView.update();
  }

} 

class FriendSprite extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix, id) {
    super(scene, x, y, spriteKey);
    this.velocity = 200;
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id;
    // this.setCollideWorldBounds(true);

    this.animName = {
      'idle': 'user-idle-' + animSuffix,
      'left': 'user-left-' + animSuffix,
      'up': 'user-up-' + animSuffix,
      'right': 'user-right-' + animSuffix,
      'down': 'user-down-' + animSuffix,
    };

    this.updateAnimation(this.animName.idle);
  }

  updateAnimation(state){
    this.play(state, true);    
  }

  /* Status display methods */
  prepareStatusView() {
    const initialtext = "Loading status..";
    this.statusView = new Status(this.scene, this, initialtext);
    this.scene.add.existing(this.statusView);
    this.statusView.setActive(false).setVisible(false);
  }

  onPointerOver() {
    console.log("PointOver")
    /* 플레이어를 호버할 때 status view를 보여주기 */
    const dummyUser = {
        "userID": "hyeon",
        "userName": "현",
        "status": "Developing objects in virtual space",
    };

    this.statusView.text = dummyUser.status;
    this.statusView.setActive(true).setVisible(true);
  }

  onPointerOut() {
    this.statusView.setActive(false).setVisible(false);
  }

  update() {
    this.statusView.update();
    // this.updateMovement(position);
  }
}

  // prepareStatusView(){
  //   this.textView = this.scene.add.text(0, -(this.avatar.height/2 + this.statusPadding), this.status, { 
  //   // this.textView = this.scene.add.text(0, 0, this.status, { 
  //       fontSize: '16px', 
  //     fontFamily: 'Lato',
  //     color: '#dddddd', 
  //     align:'center', });
  //   this.textView.setOrigin(0.5);
  //   this.graphics = this.scene.add.graphics(0, 0);
  //   this.graphics.fillStyle(0x232323, 0.6);
  
  //   const width = this.textView.width + 2 * this.paddingX;
  //   const height = this.textView.height + 2 * this.paddingY;
  //   const roundRadius = height / 2;
  //   this.graphics.fillRoundedRect(
  //     this.textView.x - this.paddingX, this.textView.y - this.paddingY, 
  //     width, height, roundRadius);

  //   this.graphics.setActive(false)
  //   this.graphics.setVisible(false);    
  //   this.textView.setActive(false)
  //   this.textView.setVisible(false);
  // } 