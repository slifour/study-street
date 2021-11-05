/** 
 * class MapScene
 * @ extends : Phaser.Scene 
 * @ extended by : FirstScene, SecondScene (all the scenes in form of navigatable map)
 * @ Reference
 * Phaser Scene class inheritance : https://youtu.be/1P8jvnj85e4
 * 
 */
import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
// import store, { UPDATE_SCORE } from '../../../store';
import socket from '../../../socket';

export default class MapScene extends Phaser.Scene {
  constructor(key, otherScene) {
    super(key);
    this.socket = socket;    
    this.bufferWidth = 50;
    this.mapKey = 'map_'+ key
    this.otherScene = otherScene
  }
  preload() {
    this.load.spritesheet('user', 'assets/spriteSheets/user.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();    
    this.createMap()
    this.createUser();
    this.createFriend();    
    this.setEventHandlers();     //Socket Event Handlers
    this.createColliders();    
  }

  update() {
    this.user.update(this.cursors);
  }

  //ANIMATIONS HELPER FUNC
  createAnimations() {
    //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('user', { frames: [0, 1, 0, 2] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('user', { frames: [3, 4, 3, 5] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('user', { frames: [6, 7, 6, 8] }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('user', { frames: [9, 10, 9, 11] }),
        frameRate: 10,
        repeat: -1
    });
  }

  setEventHandlers(){
    // Description
    // socket.on('event', eventHandler)
  
    // New user message received
    this.socket.on('stateUpdate', this.onStateUpdate.bind(this));
  }

  onStateUpdate(users){
    if(this.friends === undefined) {return}
    Object.keys(users).forEach(function(id){
      if (id === this.socket.id){ return}
      let user = users[id]
      if (Object.keys(this.friendDict).includes(id)){
        this.friendDict[id].setPosition(user.position.x, user.position.y)
      } 
      else{        
        let friend = new Friend(this, user.position.x, user.position.y, 'newt', id).setScale(0.5)
        this.friends.add(friend)
        this.friendDict[id] = friend
      }    
    }.bind(this))
  }

  //CREATE
  createMap() {
    console.log('Map Key = ', this.mapKey)
    this.map = this.add.image(0, 0, this.mapKey).setOrigin(0).setScale(1);

    // don't go out of the map
    this.physics.world.bounds.width = this.map.displayWidth + this.bufferWidth;
    this.physics.world.bounds.height = this.map.displayHeight;

    // Buffer for Scene Shift    
    this.bufferToFirst = this.add.rectangle(this.map.displayWidth, 0, this.bufferWidth, this.map.displayHeight, 0xff0000);
    
    //background

    /** Unblock Following After Drawing Tilemap */
    // // create the map
    // this.map = this.make.tilemap({
    //     key: 'library', tileWidth: 32, tileHeight: 32
    // });
    // var tileset = this.map.addTilesetImage('tiles', 'tiles');
    // var layer = this.map.createStaticLayer('backgroundLayer', tileset, 0, 0)

    // // don't go out of the map
    // this.physics.world.bounds.width = this.map.widthInPixels;
    // this.physics.world.bounds.height = this.map.heightInPixels;
  }
  
  handleEnterBuffer(){
    console.log('handleEnterBuffer')
    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.start(this.otherScene);
    })  
  }      
  
  createUser(){    
    this.user = new User(this, 100, 100, 'user').setScale(1);
    this.updateCamera()
  }

  createFriend(){
    this.friends =this.add.group();
    this.friendDict = {}
    console.log(this.friends)  
  }

  updateCamera() {
    // limit camera to map
    this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
    this.cameras.main.startFollow(this.user);
    this.cameras.main.roundPixels = true; // avoid tile bleed
  }

  createColliders(){    
    //colliders
  }

  createHelper() {
    // cursors
    this.cursors = this.input.keyboard.createCursorKeys();    
    this.createUser();    
    this.createFriend();
    this.createAnimations();    
    this.setEventHandlers(); //Socket Event Handlers
    this.createColliders();
  }


}
