import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
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
        this.load.spritesheet('user-girl', 'assets/spriteSheets/user.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('user-wizard', 'assets/spriteSheets/wizard.png', {
            frameWidth: 60,
            frameHeight: 90
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

        // this.createAnimations();
        createCharacterAnimsWizard(this.anims);
        createCharacterAnimsGirl(this.anims);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createUser();
        this.createFriend();
        this.setEventHandlers();
    }

    update() {
        this.user.update(this.cursors);
        Object.values(this.friendDict).forEach(friend => {friend.update();});
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

    createUser() {
        this.user = new User(this, 4000, 2200, 'user-girl', 'girl').setScale(2);
        this.add.existing(this.user);

        this.updateCamera();

        this.physics.add.collider(this.user, this.spawns);
        this.physics.add.collider(this.user, this.desk0);
        this.physics.add.overlap(
            this.bufferToFirst,
            this.user,
            this.handleEnterBuffer,
            undefined,
            this
        );
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


}

// module.exports = {
//     LibraryScene
// };