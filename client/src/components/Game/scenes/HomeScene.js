import Phaser from 'phaser';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";

export class HomeScene extends Phaser.Scene {
    constructor() {
      super('HomeScene');
    }
    init() {
        console.log('Welcome to Home');
    };

    preload() {
        // this.load.image("library", "assets/map/library_small.png");
        this.load.image('tiles', 'assets/map/tiles1.png');
        this.load.image('desk', 'assets/images/desk.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('sitShadow', 'assets/images/sitShadow.png');
        this.load.image('sitText', 'assets/images/sitText.png');
        // map in json format
        this.load.tilemapTiledJSON('library', 'assets/map/library.json');
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
        this.otherUsers = this.physics.add.group();
        // create map
        this.createMap();
        this.createDesk();

        this.createAnimations();
        this.cursors = this.input.keyboard.createCursorKeys();

        this.createUser({
            x: 0,
            y: 0
        });

        this.input.on('pointerdown', function(){
            this.handleEnterBuffer();
            // this.scene.start('Rest');
            // this.scene.launch('Rest')
            // console.log("FirstScene -> LoadScene. Input : pointerdown")
            // this.scene.resume('LoadScene');  
            // console.log("LoadScene resumed")
            // this.scene.stop('FirstScene');
        }, this);
    }

    createMap() {
        // create the map
        this.map = this.make.tilemap({
            key: 'library', tileWidth: 32, tileHeight: 32
        });
        var tileset = this.map.addTilesetImage('tiles', 'tiles');
        var layer = this.map.createStaticLayer('backgroundLayer', tileset, 0, 0)

        // don't go out of the map
        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;
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

    createUser(userInfo) {
        console.log('CreateUser')
        // our user sprite created through the physics system
        this.user = this.add.sprite(0, 0, 'user', 6);
        this.user.setScale(2)

        this.date = this

        this.container = this.add.container(userInfo.x, userInfo.y);
        this.container.setSize(64, 64);
        this.physics.world.enable(this.container);
        this.container.add(this.user);

        // update camera
        this.updateCamera();

        // don't go out of the map
        this.container.body.setCollideWorldBounds(true);

        this.physics.add.collider(this.container, this.spawns);
        this.physics.add.collider(this.container, this.desk0);
    }
    
    handleEnterBuffer(){
        // this.scene.start('Rest');
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
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.container);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    }

    updateMovement() {
        this.container.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.container.body.setVelocityX(-150);
        } else if (this.cursors.right.isDown) {
            this.container.body.setVelocityX(150);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.container.body.setVelocityY(-150);
        } else if (this.cursors.down.isDown) {
            this.container.body.setVelocityY(150);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.user.anims.play('left', true);
            this.user.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.user.anims.play('right', true);
            this.user.flipX = false;
        } else if (this.cursors.up.isDown) {
            this.user.anims.play('up', true);
        } else if (this.cursors.down.isDown) {
            this.user.anims.play('down', true);
        } else {
            this.user.anims.stop();
        }
    }

    update() {
        this.updateMovement()
    }
}

// module.exports = {
//     LibraryScene
// };