import Phaser from 'phaser';
import Status from './Status';

export default class Friend extends Phaser.Physics.Arcade.Sprite {
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

    /* Status display */
    this.setInteractive();
    this.prepareStatusView();
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);
  }

  setId(id){
    this.id = id
  }

  updateAnimation(state){
    this.play(state, true);    
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

    this.updateAnimation(animState)
    
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
  }

  onPointerOut() {
    this.statusView.setActive(false).setVisible(false);
  }

  update() {
    this.statusView.update();
    // this.updateMovement(position);
  }
}
