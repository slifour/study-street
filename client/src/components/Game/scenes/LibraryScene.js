import Phaser from 'phaser';
import User from '../entity/User';
import Friend from '../entity/Friend';
import socket from '../../../socket';
import { createCharacterAnimsGirl, createCharacterAnimsWizard } from '../anims/CharacterAnims';
import GroupArea from '../entity/GroupArea';
import Tooltip from '../entity/Tooltip';
import Book from '../entity/Book';
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
        this.groupAreas = {};        
    };

    firstOverlap(){
        return this.firstOverlap


    }

    preload() {
        // this.load.image("library", "assets/map/library_small.png");
        // this.load.image('map_library', 'assets/map/map_library.png');
        this.load.image('desk', 'assets/images/desk_4.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('sitShadow', 'assets/images/sitShadow.png');
        this.load.image('sitText', 'assets/images/sitText.png');
        this.load.image('bookshelf', 'assets/images/book-shelf.png');
        this.load.image('book-side', 'assets/images/book-red.png');
        // this.load.image('book-right', 'assets/images/book-right.png');
        // this.load.image('book-center', 'assets/images/book-center.png');
        // this.load.image('book-left', 'assets/images/book-left.png');

        // map in json format
        this.load.image('libraryTiles1', 'assets/map/libraryTiles1.png');
        this.load.image('libraryTiles2', 'assets/map/libraryTiles2.png');
        this.load.image('libraryTiles3', 'assets/map/libraryTiles3.png');

        this.load.tilemapTiledJSON('libraryMap', 'assets/map/libraryMap.json');

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

    /*
     * Map 에 create 해야할 sprites 
     */    

    createGroupArea(groupKey){
        let groupArea = new GroupArea(this, 500, 400)
        groupArea.init('desk', 'chair', 'bookshelf')
        // this.nextBookPosition = groupArea.positions[0]
        groupArea.setPosition(500, 400)
        this.groupAreas[groupKey] = groupArea
    }

    createChair() {

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
        // this.input.on('pointerdown', function(){
        //     this.handleEnterBuffer();
        // //     // this.scene.start('Rest');
        // //     // this.scene.launch('Rest')
        // //     // console.log("FirstScene -> LoadScene. Input : pointerdown")
        // //     // this.scene.resucme('LoadScene');  
        // //     // console.log("LoadScene resumed")
        // //     // this.scene.stop('FirstScene');
        //  }, this);
        // create map
        this.createMap();
        this.createGroupArea('a');
        // this.createAnimations();
        createCharacterAnimsWizard(this.anims);
        createCharacterAnimsGirl(this.anims);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.createUser();
        this.createFriend();
        this.setEventHandlers();
        this.socket.emit("initializeLibrary");
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                socket.emit("newArtifact")
                console.log("emit : newArtifact")
            },
            loop: false
        })
    }

    update() {
        this.user.update(this.cursors);
        Object.values(this.friendDict).forEach(friend => {friend.update();});
    }

    createMap() {
        // create the map
        this.map = this.make.tilemap({ key: 'libraryMap' });
        const tileset1 = this.map.addTilesetImage('libraryTiles1', 'libraryTiles1');
        const tileset2 = this.map.addTilesetImage('libraryTiles2', 'libraryTiles2');
        const tileset3 = this.map.addTilesetImage('libraryTiles3', 'libraryTiles3');
        const allTiles = [tileset1, tileset2, tileset3];

        this.belowPlayer1 = this.map.createLayer('Below Player1', allTiles);
        this.world1 = this.map.createLayer('World', allTiles);

        this.belowPlayer1.setCollisionByProperty({ collides: true });
        this.world1.setCollisionByProperty({ collides: true });

        this.belowPlayer1.setScale(1.2);
        this.world1.setScale(1.2);

        // don't go out of the map
        this.physics.world.bounds.width = this.map.displayWidth;
        this.physics.world.bounds.height = this.map.displayHeight;
        this.bufferToFirst = this.add.rectangle(this.map.displayWidth-this.bufferWidth/2, this.map.displayHeight/2, this.bufferWidth, this.map.displayHeight, 0xff0000);
        this.physics.add.existing(this.bufferToFirst)
    }

    createUser() {
        this.user = new User(this, 800, 400, 'user-girl', 'girl').setScale(3/100 * 1.2);

        this.updateCamera();

        this.physics.add.collider(this.user, this.spawns);
        this.physics.add.collider(this.user, this.desk0);
        this.physics.add.collider(this.user, this.belowPlayer1);
        this.physics.add.collider(this.user, this.world1);
        // this.physics.add.overlap(
        //     this.bufferToFirst,
        //     this.user,
        //     this.handleEnterBuffer,
        //     undefined,
        //     this
        // );
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
        this.socket.on('newArtifact', this.onNewArtifact.bind(this));
        this.socket.on('newGroup', this.onNewGroup.bind(this))
        this.socket.on("goalUpdate", this.onGoalUpdate.bind(this));
      }
    
    onNewGroup(){
        this.createGroupArea()
    }  

    onNewArtifact(data){
        // console.log('recieve : newArtifact')
        
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let tooltip = new Tooltip(this, screenCenterX, screenCenterY, 'book-front', 'newArtifact');
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
              tooltip.onArtifactTooltipClicked(this.nextBookPosition)
            },
            loop: false
        })
        // let book = new Book(this, screenCenterX, screenCenterY, 'book-front').setScale(0.5);
        // tooltip.addListener('click', this.onArtifactTooltipClicked.bind(this, book));

        // tooltip.on('click', this.onArtifactTooltipClicked.bind(this, book));
        // // this.tooltipContainer = this.add.container(screenCenterX, screenCenterY);
        // let tooltip = this.add.dom(screenCenterX, screenCenterY);             
        // tooltip.createFromCache('newArtifact');updateBooks

        // // tooltipContainer.add(tooltip);   
        // // tooltipContainer.fixedToCamera = true;

        // this.newArtifact = new Book(this, screenCenterX, screenCenterY, 'book-front');
        // // tooltipContainer.add(this.newArtifact)        
    }

    // onArtifactTooltipClicked(){
    //     this.tooltip.destroy()
    //     this.cameras.main.startFollow(book);
    //     this.physics.moveToObject(book, this.nextBookPosition[this.nextBookIndex].x, this.nextBookPosition[this.nextBookIndex].y, 300);
    //     if (book.x === this.nextBookPosition.x){
    //         this.cameras.main.startFollow(this.user);
    //     }        
    //     this.nextBookIndex += 1;
    // }

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

/** 
 * let bookList = {
  "a": {
    0 : [1,3,1,1,1],
    1 : [5,3,2,3],
  },
  "b": {
  },  
}
 * @param {*} bookList 
 */
    onGoalUpdate(bookList){
        console.log('onGoalUpdate')
        for (const [groupId, value] of Object.entries(bookList)) {
            if (Object.keys(this.groupAreas).includes(groupId)){
                let groupArea = this.groupAreas[groupId]
                groupArea.updateBooks(value) 

                console.log(groupId, value);
            }           
        }        
    }

}

// module.exports = {
//     LibraryScene
// };