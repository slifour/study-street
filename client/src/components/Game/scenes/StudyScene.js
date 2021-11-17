import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
import GroupArea from '../entity/GroupArea';
import Desk from '../entity/Desk';
import Tooltip from '../entity/HtmlModal';
import Book from '../entity/Book';
/** 
 * class StudyScene
 * @ extends : Phaser.Scene 
 * @ extended by : FirstScene, SecondScene (all the scenes in form of navigatable map)
 * @ Reference
 * Phaser Scene class inheritance : https://youtu.be/1P8jvnj85e4
 * 
 */

export default class Study extends Phaser.Scene {
  constructor() {
    super('Study');
    this.key = 'Study'
    this.socket = socket;       
    console.log("Welcome to ", 'Study'); 
  }

  init(data) {    
    console.log("Welcome to ", 'Study');  
    this.deskPosition = {x : 0 , y: 0};
    this.desk = null;
    this.index = data.index;
    this.prevScene = data.prevScene; 
    console.log(this.index)
  }

  preload() {
    this.load.image('desk', 'assets/images/desk_4.png');
    this.load.image('chair', 'assets/images/chair.png');
    this.load.image('sitShadow', 'assets/images/sitShadow.png');
    this.load.image('sitText', 'assets/images/sitText.png');
    this.load.image('bookshelf', 'assets/images/book-shelf.png');
    this.load.image('book-side', 'assets/images/book-red.png');

    this.load.spritesheet('user-girl', 'assets/spriteSheets/user_1.png', {
        frameWidth: 32 * (100/3),
        frameHeight: 42 * (100/3)
    });
    this.load.spritesheet('user-wizard', 'assets/spriteSheets/wizard.png', {
        frameWidth: 60,
        frameHeight: 90
    });
    this.load.spritesheet('booksheet', 'assets/spriteSheets/booksheet.png', {
        frameWidth: 28,
        frameHeight: 35
    });
    this.load.html('newArtifact', 'assets/NewArtifact.html')
    this.load.html('alert', 'assets/NewAlert.html')
  }

  create() {    
    this.createUser();
    this.createDesk(0, 0, 'desk', 'chair');
    const chair = this.desk.getAt(this.index);
    chair.sit();
    this.cameras.main.centerOn(this.desk.x + this.cameras.main.width/4 , this.desk.y);
    this.setEventHandlers();

    // createCharacterAnimsWizard(this.anims);
    // createCharacterAnimsGirl(this.anims);
    // this.cursors = this.input.keyboard.createCursorKeys();
    // this.createFriend();

  }

  createUser() {
    this.user = new User(this, 0, 0, 'user-girl', 'girl').setScale(3/100 * 1.2);
  }

  /** createDesk
   * @parameter x, y, deskKey : spritekey for desk, chairkey : spritekey for chair
   * @sideEffect create Desk : extends sprite, defined in entity/Desk.js
   */
  createDesk(x, y, deskKey, chairKey) {
    this.desk = new Desk(this, x, y, deskKey, chairKey, false);    
  };    

  onStateUpdate(users){
    if(this.friends === undefined) {return;}
    Object.keys(users).forEach(function(id) {        
        if (id === this.socket.id) {return;}

        console.log('Not returned');
        let user = users[id]
        if (Object.keys(this.friendDict).includes(id)){
            console.log(id, this.socket.id);
            this.friendDict[id].updateMovement(user.position);
        } else {        
            let friend = new Friend(this, user.position.x, user.position.y, 'user-wizard', 'wizard', id).setScale(1);
            this.friends.add(friend);
            this.friendDict[id] = friend;
        }    
    }.bind(this))
  }

  setEventHandlers(){
    this.game.events.on('studyToLibrary', () => {
      this.changeScene('Library')
    })
    // Description
    // socket.on('event', eventHandler)
  
    // New user message received
    this.socket.on('stateUpdate', this.onStateUpdate.bind(this));
  }

  changeScene(newScene){
    this.game.events.emit("changeScene", newScene);
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
        // this.doUpdate = false
        this.scene.start(newScene, {prevScene: this.key});
    })  
};


}
