import Phaser from 'phaser';
import uniqueString from 'unique-string';
import socket from '../../../socket';
import { getParsedDuration } from '../utils/Time';
import Status from './Status';

export default class Friend extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, animSuffix, id) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.id = id;

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

    this.requestKey = null;
    this.onResponseOK = null;
    this.onResponseFail = null;
  }

  setId(id){
    this.id = id
  }

  updateAnimation(state){
    this.play(state, true);    
  }

  updateMovement(position) {
    this.setPosition(position.x, position.y);
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

    // TODO: 씬에 들어온 다른 플레이어의 ID를 가져오기
    const dummyID = "haeseul";

    const requestType = "REQUEST_MY_PROFILE";
    const responseType = "RESPONSE_MY_PROFILE";
    this.requestKey = uniqueString();

    this.onResponseOK = ({payload}) => {
      console.log("OK: ", payload);
      this.statusView.text = `${dummyID}: ${getParsedDuration(payload.todayStudyTime)}`;
      this.statusView.update();
    };
    
    this.onResponseFail = ({payload}) => {
      console.warn("Phaser: ", payload.msg || "Failed to load friend's profile");
    };
    
    this.onResponse = ({responseType, requestKey, status, payload}) => {
      if (requestKey === this.requestKey) {
        console.log("Phaser request: got response ", {responseType, requestKey, status, payload});
        switch (status) {
          case "STATUS_OK": 
            this.onResponseOK && this.onResponseOK({requestKey, status, payload});
          break;
          case "STATUS_FAIL":
            this.onResponseFail && this.onResponseFail({requestKey, status, payload});
            break;
        }
      }
    }

    socket.on(responseType, this.onResponse);

    socket.emit(requestType, {
      requestUser: this.scene.game.registry.get("loginUser").userID,
      requestKey: this.requestKey,
      requestType,
      payload: { userID: dummyID }
    });
    this.statusView.setActive(true).setVisible(true);
  }

  onPointerOut() {
    const responseType = "RESPONSE_MY_PROFILE";
    this.statusView.setActive(false).setVisible(false);
    socket.off(responseType, this.onResponse);
  }

  update() {
    this.statusView.update();
    // this.updateMovement(position);
  }
}
