import Phaser from 'phaser';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://localhost:4001";
import { socket } from '../../../socket';

export class LibraryScene extends Phaser.Scene {
    constructor() {
        super('LibraryScene');
    }

    init() {
        this.socket = socket;
        console.log('Welcome to LibraryScene');
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

        this.socket.on('newUser', function (userInfo) {
            console.log('new user:', userInfo.userId);
            this.addOtherUsers(userInfo);
        }.bind(this));

        this.socket.on('disconnect', function (userId) {
            this.otherUsers.getChildren().forEach(function (user) {
                if (userId === user.userId) {
                    user.destroy();
                }
            }.bind(this));
        }.bind(this));

        this.socket.on('userMovementBroadcast', function (userInfo) {
            this.otherUsers.getChildren().forEach(function (user) {
                if (userInfo.userId === user.userId) {
                    user.flipX = userInfo.flipX;
                    user.setPosition(userInfo.x, userInfo.y);
                }
            }.bind(this));
        }.bind(this));
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

    emitMovement() {
        // /**
        //  * @typedef {Object} movement
        //  * @property {number} x
        //  * @property {number} y
        //  * @property {Object} oldPosition
        //  * @property {number} oldPosition.x
        //  * @property {number} oldPosition.y
        //  * @property {boolean} oldPosition.flipX
        //  */
        // /**
        //  * @param {movement} movement
        //  */
        // emit user movement
        var x = this.container.x;
        var y = this.container.y;
        var flipX = this.user.flipX;
        if (this.container.oldPosition && (x !== this.container.oldPosition.x || y !== this.container.oldPosition.y || flipX !== this.container.oldPosition.flipX)) {
            this.socket.emit('userMovement', { x, y, flipX });
        }
        // save old position data
        this.container.oldPosition = {
            x: this.container.x,
            y: this.container.y,
            flipX: this.user.flipX
        };
    }

    update() {
        if (this.container) {
            this.updateMovement()
            this.emitMovement();
        }

        /*
        if (this.player?.scene !== undefined) {
            
            //all scene update code here
            // update : user movement 
            // condition : cursor(arrow key) pressed
            if (this.container) {
                this.updateMovement()
                this.emitMovement();
            }
        }
        */
    }

}

// module.exports = {
//     LibraryScene
// };