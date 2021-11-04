import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";

export default class Library extends Phaser.Scene {
    constructor() {
      super('Library');
      this.socket = socket;   
    }
    init() {
        console.log('Welcome to Library');
        this.bufferWidth = 10
        this.firstOverlap = true 
    };

    firstOverlap(){
        return this.firstOverlap
    }

    preload() {
        // this.load.image("library", "assets/map/library_small.png");
        this.load.image('map_library', 'assets/map/map_library.png');
        this.load.image('desk', 'assets/images/desk.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('sitShadow', 'assets/images/sitShadow.png');
        this.load.image('sitText', 'assets/images/sitText.png');
        // map in json format
        this.load.spritesheet('user', 'assets/spriteSheets/user.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    /*
     * Map 에 create 해야할 sprites 
     */    
    createDesk() {
        this.desk0 = this.physics.add.image(500, 200, 'desk');
        this.desk0.setImmovable(true);        
    } 

    /*
     * Create
     */
    create() {
        console.log('library create')
        this.otherUsers = this.physics.add.group();
        /**
         * If pointerdown (마우스 클릭) -> handleEnterBuffer() 를 호출해서 restScene 으로 이동
         * 조건을 scene 아무데나 pointerdown 에서 'Quick Rest' react component를 클릭할 때로 변경해야 함.
         * 이동 전에 Are you sure to go to rest? 툴팁이 한 번 뜨면 좋을 것 같다. 
         */
        this.input.on('pointerdown', function(){
            this.handleEnterBuffer();
            // this.scene.start('Rest');
            // this.scene.launch('Rest')
            // console.log("FirstScene -> LoadScene. Input : pointerdown")
            // this.scene.resucme('LoadScene');  
            // console.log("LoadScene resumed")
            // this.scene.stop('FirstScene');
         }, this);
        // create map
        this.createMap();
        this.createDesk();

        this.createAnimations();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createUser();
        this.createFriend();
        this.setEventHandlers();
    }

    update() {
        this.user.update(this.cursors);
    }

    createMap() {
        // create the map
        this.map = this.add.image(0, 0, 'map_library').setOrigin(0).setScale(1);
        console.log(this.map.displayWidth, this.map.displayHeight) // 4403 4347

        // don't go out of the map
        this.physics.world.bounds.width = this.map.displayWidth;
        this.physics.world.bounds.height = this.map.displayHeight;

        this.bufferToFirst = this.add.rectangle(this.map.displayWidth-this.bufferWidth/2, this.map.displayHeight/2, this.bufferWidth, this.map.displayHeight, 0xff0000);
        this.physics.add.existing(this.bufferToFirst)
    }

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

    createUser() {
        this.user = new User(this, 4000, 2200, 'user').setScale(2);
        this.user.setCollideWorldBounds(true);

        // this.container = this.add.container(userInfo.x, userInfo.y);
        // this.container.setSize(64, 64);
        // this.physics.world.enable(this.container);
        // this.container.add(this.user);

        // update camera
        this.updateCamera();

        // don't go out of the map
        // this.container.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.user, this.spawns);
        this.physics.add.collider(this.user, this.desk0);
        this.physics.add.overlap(
            this.bufferToFirst,
            this.user,
            this.handleEnterBuffer,
            undefined,
            this
        )
    }

    createFriend(){
        this.friends =this.add.group();
        this.friendDict = {}
        console.log(this.friends)  
    }

    handleEnterBuffer(){
        // this.scene.start('Rest');
        // this.physics.destroy(this.bufferToFirst)
        this.firstOverlap = false
        console.log('handleEnterBuffer')        
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
            // this.doUpdate = false
            this.scene.start('Rest');
        })  
    }     

    updateCamera() {
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(this.user);
        this.cameras.main.roundPixels = true; // avoid tile bleed
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
        if (id === this.socket.id) {return}
        console.log('Not returned')
        let user = users[id]
        if (Object.keys(this.friendDict).includes(id)){
            console.log(id, this.socket.id)
            this.friendDict[id].setPosition(user.position.x, user.position.y)
        } 
        else{        
            let friend = new Friend(this, user.position.x, user.position.y, 'user', id).setScale(2)
            this.friends.add(friend)    
            this.friendDict[id] = friend
        }    
    }.bind(this))
    }


}

// module.exports = {
//     LibraryScene
// };