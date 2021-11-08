import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";

export default class Rest extends Phaser.Scene {
    constructor() {
      super('Rest');
    }
    init() {
        console.log('Welcome to Rest');
        this.bufferWidth = 10
    };

    preload() {
        // this.load.image("Rest", "assets/map/Rest_small.png");
        this.load.image('map_rest', 'assets/map/map_rest.png');
        this.load.image('desk', 'assets/images/desk.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('sitShadow', 'assets/images/sitShadow.png');
        this.load.image('sitText', 'assets/images/sitText.png');
        // map in json format
        this.load.spritesheet('user', 'assets/spriteSheets/user.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // map in json format
        this.load.image('restTiles1', 'assets/map/restTiles1.png');
        this.load.image('restTiles2', 'assets/map/restTiles2.png');
        this.load.image('restTiles3', 'assets/map/restTiles3.png');

        this.load.tilemapTiledJSON('restMap', 'assets/map/restMap.json');
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
        console.log('rest create')
        this.otherUsers = this.physics.add.group();
        /**
         * If pointerdown (마우스 클릭) -> handleEnterBuffer() 를 호출해서 restScene 으로 이동
         * 조건을 scene 아무데나 pointerdown 에서 'Quick Rest' react component를 클릭할 때로 변경해야 함.
         * 이동 전에 Are you sure to go to rest? 툴팁이 한 번 뜨면 좋을 것 같다. 
         */
        this.input.on('pointerdown', function(){
            this.handleEnterBuffer();

            // console.log("FirstScene -> LoadScene. Input : pointerdown")
            // this.scene.resume('LoadScene');  
            // console.log("LoadScene resumed")
            // this.scene.stop('FirstScene');
         }, this);
        // create map
        this.createMap();
        this.createDesk();

        this.createAnimations();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createUser();
    }

    /** CreateMap()
     * - Add tilemap
     * - Set boundary
     * - Add buffer to another scene (library scene)
     */
    createMap() {
        // create the map
        this.map = this.make.tilemap({ key: 'restMap' });
        const tileset1 = this.map.addTilesetImage('restTiles1', 'restTiles1');
        const tileset2 = this.map.addTilesetImage('restTiles2', 'restTiles2');
        const tileset3 = this.map.addTilesetImage('restTiles3', 'restTiles3');
        const allTiles = [tileset1, tileset2, tileset3];

        this.belowPlayer1 = this.map.createLayer('Below Player1', allTiles);
        this.belowPlayer2 = this.map.createLayer('Below Player2', allTiles);
        this.belowPlayer3 = this.map.createLayer('Below Player3', allTiles);
        this.world1 = this.map.createLayer('World1', allTiles);
        this.world2 = this.map.createLayer('World2', allTiles);
        this.abovePlayer = this.map.createLayer('Above Player', allTiles);

        this.belowPlayer1.setCollisionByProperty({ collides: true });
        this.world1.setCollisionByProperty({ collides: true });
        this.world2.setCollisionByProperty({ collides: true });
        this.abovePlayer.setDepth(10);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.displayWidth;
        this.physics.world.bounds.height = this.map.displayHeight;

        this.bufferToFirst = this.add.rectangle(this.bufferWidth/2, this.map.displayHeight/2, this.bufferWidth, this.map.displayHeight);
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
        this.user = new User(this, 0, 0, 'user').setScale(2);
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
        this.physics.add.collider(this.container, this.belowPlayer1);
        this.physics.add.collider(this.container, this.world1);
        this.physics.add.collider(this.container, this.world2);
        // this.physics.add.overlap(
        //   this.bufferToFirst,
        //   this.user,
        //   this.handleEnterBuffer,
        //   this.firstOverlap,
        //   this
        // )
    }

    handleEnterBuffer(){
        // this.scene.start('Library');
        // this.physics.destroy(this.bufferToFirst)
        console.log('handleEnterBuffer')        
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            // this.user.setPosition(this.user.x-this.bufferWidth, this.user.y)
            // this.doUpdate = false
            this.scene.start('Library');
        })  
    }   

    addOtherUsers(userInfo) {
        console.log("add other users:", userInfo.userId);
        // const otherUser = this.add.sprite(userInfo.x, userInfo.y, 'user', 9);
        const otherUser = this.add.sprite( Math.random() * this.cameras.main.width, Math.random() * this.cameras.main.height, 'user', 9); 
        otherUser.setTint(Math.random() * 0xffffff);
        otherUser.userId = userInfo.userId;
        this.otherUsers.add(otherUser);
        this.updateCamera();
    }

    updateCamera() {
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.displayWidth, this.map.displayHeight);
        this.cameras.main.startFollow(this.user);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    }

    update() {
        this.user.update(this.cursors);
    }
}

// module.exports = {
//     RestScene
// };