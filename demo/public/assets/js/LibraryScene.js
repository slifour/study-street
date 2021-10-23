import { StudyScene } from "./StudyScene.js";
export class LibraryScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init() {
        this.socket = this.registry.get('socket')
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

        this.load.spritesheet('user', 'assets/spritesheet_user.png', {
            frameWidth: 32,
            frameHeight: 32
        });

    }

    /*
     * Map 에 create 해야할 sprites 
     */
    createGroupArea() {
        throw { name: "NotImplementedError" };
    }

    createGroupArtifacts() {
        throw { name: "NotImplementedError" };
    }

    createDesk() {
        this.desk0 = this.physics.add.image(500, 200, 'desk');
        this.desk0.setImmovable(true);        
    }

    createChair() {
        this.sitGroup = this.add.container(300, 350);        
        this.sitGroup.add(this.add.sprite(0,20,'sitShadow'))
        this.sitGroup.add(this.add.sprite(0,-70,'sitText'))
        this.sitGroup.setVisible(false)
       
        this.chair = this.physics.add.image(300, 350, 'chair');     
        this.chair.setInteractive().on('pointerdown', this.toStudyScene.bind(this, this.chair.x, this.chair.y))        
 
    }

    handleCloseToChair() {
        this.sitGroup.setVisible(true);
        this.time.delayedCall(3000, function(){
            this.sitGroup.setVisible(false);
        }, null, this);
    }

    /*
     * Udates from server (다른 유저 movement는 create()으로)
     */

    // 누군가 도서관으로 올 때
    otherCome(user) {
        throw { name: "NotImplementedError" };
    };

    // 누군가 공부 시작할 때
    otherStudy(user, chairId) {
        throw { name: "NotImplementedError" };
    };

    // 누군가 쉬러 갔을 때
    otherRest(user) {
        throw { name: "NotImplementedError" };
    };

    // 새로운 group artifact 획득
    newGroupArtifact(artifact) {
        throw { name: "NotImplementedError" };
    }

    // 누군가 status 변경했을 때
    otherStatus() {
        throw { name: "NotImplementedError" };
    }

    /*
     * User가 할 수 있는 일시적 Events + 그 Event 서버로 emit하기
     */

    // 아래 event server로 emit, 선택한 의자 id 전송
    emitStudy(x, y) {
        this.socket.emit('userStudy');
    };
    // Study Scene 으로 shift
    toStudyScene(x, y) {
        

        this.emitStudy(x, y)
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.add('Study', new StudyScene(), true);
        })        
    }

    // 아래 event server로 emit
    emitRest() {
        this.socket.emit('userRest');
    };
    // Rest Scene 으로 shift
    toRestScene() {
        this.scene.start("RestScene", {
            "title": "data to toss"
        });
    };


    /*
     * 실시간으로 Update 되야 하는 것 (다른 유저 movement는 create()으로)
     */

    // 공부 중인 사람들 Timer

    // Movement
    updateMovement(container) {
        container.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            container.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            container.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            container.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            container.body.setVelocityY(80);
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

    emitMovement(container) {
        // emit user movement
        var x = container.x;
        var y = container.y;
        var flipX = this.user.flipX;
        if (container.oldPosition && (x !== container.oldPosition.x || y !== container.oldPosition.y || flipX !== container.oldPosition.flipX)) {
            this.socket.emit('userMovement', { x, y, flipX });
        }
        // save old position data
        container.oldPosition = {
            x: container.x,
            y: container.y,
            flipX: this.user.flipX
        };
    }

    /*
     * Create
     */
    create() {
        // this.socket = io();
        // var counter = data.counter;                 
        this.scene.remove('Boot');
        this.socket.emit('shiftScene', 'Library');
        this.otherUsers = this.physics.add.group();

        // create map
        // create user animations
        // user input
        this.createMap();
        this.createDesk();
        this.createChair();
        // this.createGroupArea();

        this.createAnimations();
        this.cursors = this.input.keyboard.createCursorKeys();

        // listen for web socket events
        this.socket.on('currentUsers', function (users) {
            console.log('currentUsers')
            users.forEach(function (user) {
                if (user.userId === this.socket.id) {
                    this.createUser(user);
                } else {
                    this.addOtherUsers(user);
                }
            }.bind(this));
        }.bind(this));

        this.socket.on('newUser', function (userInfo) {
            this.addOtherUsers(userInfo);
        }.bind(this));

        this.socket.on('disconnect', function (userId) {
            this.otherUsers.getChildren().forEach(function (user) {
                if (userId === user.userId) {
                    user.destroy();
                }
            }.bind(this));
        }.bind(this));

        this.socket.on('otherMoved', function (userInfo) {
            this.otherUsers.getChildren().forEach(function (user) {
                if (userInfo.userId === user.userId) {
                    user.flipX = userInfo.flipX;
                    user.setPosition(userInfo.x, userInfo.y);
                }
            }.bind(this));
        }.bind(this));

        this.socket.on('otherStudy', function (userInfo, chair) {
            this.otherUsers.getChildren().forEach(function (user) {
                if (userInfo.userId === user.userId) {
                    otherToStudyScene(user, chair);
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
    //    / this.physics.add.collider(this.container, this.chair);

        this.physics.add.overlap(
            this.chair,
            this.container,
            this.handleCloseToChair,
            undefined,
            this
        )
    }

    addOtherUsers(userInfo) {
        const otherUser = this.add.sprite(userInfo.x, userInfo.y, 'user', 9);
        otherUser.setTint(Math.random() * 0xffffff);
        otherUser.userId = userInfo.userId;
        this.otherUsers.add(otherUser);
    }

    updateCamera() {
        // limit camera to map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.container);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    }

    getValidLocation() {
        var validLocation = false;
        var x, y;
        while (!validLocation) {
            x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

            var occupied = false;
            this.spawns.getChildren().forEach((child) => {
                if (child.getBounds().contains(x, y)) {
                    occupied = true;
                }
            });
            if (!occupied) validLocation = true;
        }
        return { x, y };
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
        if(this.sys.settings.status < Phaser.Scenes.RUNNING){
            return;
        }
        if (this.container) {
            this.updateMovement()
            this.emitMovement();
        }
        if (this.player?.scene !== undefined) {
            
            //all scene update code here
            // update : user movement 
            // condition : cursor(arrow key) pressed
            if (this.container) {
                this.updateMovement()
                this.emitMovement();
            }
        }
    }

}

// module.exports = {
//     LibraryScene
// };