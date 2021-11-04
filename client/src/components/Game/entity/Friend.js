import Phaser from 'phaser';
import Status from './Status';

export default class Friend extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, id) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id

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

  updateMovement(position) {
    this.setPosition(position.x, position.y)
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
