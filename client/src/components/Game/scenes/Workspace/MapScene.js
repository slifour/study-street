import Phaser from 'phaser';
import Player from '../entity/Player';
import Friend from '../entity/Friend';
import Ground from '../entity/Ground';
// import store, { UPDATE_SCORE } from '../../../store';
import network from '../../network';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.socket = network.socket;    
  }
  preload() {
    //PRELOAD SPRITES
    this.load.image('woods', './assets/backgrounds/woods.png');
    this.load.spritesheet('newt', 'assets/spriteSheets/newt.png', {
      frameWidth: 118.1,
      frameHeight: 131,
    });
    this.load.image('ground', 'assets/sprites/ground.png');
    this.load.image('mainGround', 'assets/sprites/mainGround.png');
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('twinkle', 'assets/audio/twinkle.wav');
  }

  //ANIMATIONS HELPER FUNC
  createAnimations() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('newt', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'leftJump',
      frames: [{ key: 'newt', frame: 2 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'newt', frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'rightJump',
      frames: [{ key: 'newt', frame: 6 }],
      frameRate: 20,
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('newt', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'wearingHat',
      frames: [{ key: 'newt', frame: 10 }],
      frameRate: 20,
    });
  }

  setEventHandlers(){
    // Description
    // socket.on('event', eventHandler)
  
    // New player message received
    this.socket.on('stateUpdate', this.onStateUpdate.bind(this));
  }

  onStateUpdate(players){
    if(this.friends === undefined) {return}
    Object.keys(players).forEach(function(id){
      if (id == network.id){ return}
      let player = players[id]
      if (Object.keys(this.friendDict).includes(id)){
        this.friendDict[id].setPosition(player.position.x, player.position.y)
      } 
      else{        
        let friend = new Friend(this, player.position.x, player.position.y, 'newt', id).setScale(0.5)
        this.friends.add(friend)
        this.friendDict[id] = friend
      }    
    }.bind(this))
  }

  //CREATE
  createWorld(){
    //set up world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    //background
    this.add.image(-160, 0, 'woods').setOrigin(0).setScale(0.5);

    //platforms
    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });

    this.groundGroup.create(160, 100, 'ground');
    this.groundGroup.create(250, 350, 'ground');
    this.groundGroup.create(530, 200, 'ground');
    this.groundGroup.create(600, 510, 'ground');

    //floor
    this.groundGroup.create(160, 620, 'mainGround');

  }

  createPlayer(){
    //player
    this.player = new Player(this, 20, 400, 'newt').setScale(0.5);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.createAnimations();    

    //cursors
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createFriend(){
    this.friends =this.add.group();
    this.friendDict = {}
    console.log(this.friends)  
  }
  createColliders(){
    //colliders
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.friends, this.groundGroup);
  }

  createHelper() {
    this.createWorld()
    this.createPlayer()
    this.createFriend()
    //Socket Event Handlers
    this.setEventHandlers();
    this.createColliders()
  }

  create() {
    this.createHelper()
  }

  update() {
    this.player.update(this.cursors);
  }
}
