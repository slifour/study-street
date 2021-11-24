import Phaser, { GameObjects } from "phaser";
import uniqueString from 'unique-string';
import socket from '../../../socket';
import { getParsedDuration } from '../utils/Time';
import Status from './Status';
import UserContainer from './UserContainer';

export default class Friend extends UserContainer{
  constructor(scene, position, spriteKey, animSuffix, loginUser, sizeFactor) {
    super(scene, position, spriteKey, animSuffix, loginUser, sizeFactor, "...");
    this.velocity = 200;    
  }

  showStatus() {
    console.log("PointOver")
    /* 플레이어를 호버할 때 status view를 보여주기 */

    // TODO: 씬에 들어온 다른 플레이어의 ID를 가져오기

    const requestType = "REQUEST_MY_PROFILE";
    const responseType = "RESPONSE_MY_PROFILE";
    this.requestKey = uniqueString();

    this.onResponseOK = ({payload}) => {
      console.log("OK: ", payload);
      this.statusView.text = `${getParsedDuration(payload.todayStudyTime)}`;
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
      payload: { userID: this.userID }
    });
    this.statusView.setActive(true).setVisible(true);
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

    this.sprite.updateAnimation(animState)
    
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

  stand(){
    if (this.chair !== null){
      this.chair.setInteractions(true);
      this.chair = null;
    }
  }
} 

