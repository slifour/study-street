import GroupArea from '../entity/GroupArea';
import Phaser from 'phaser';
import Desk from '../entity/Desk';
import Bookshelf from '../entity/Bookshelf';
import HtmlModal from '../entity/HtmlModal';
import Book from '../entity/Book';
import MapScene from './MapScene';
import PostPage from '../../ui/Study/PostPage';

export default class Library extends MapScene {
    constructor() {
      super('Library');
    }

    init(data) {
        super.init(data);              
        this.groupAreas = {};      
        this.areas = [];
        this.groupToIndex = {};
        this.borderWidth = 3  
        this.nextdeskId = 0;
        this.friendDictStudying = {};
        console.log("this.nextdeskId", this.nextdeskId);
    };

    preload() {
        super.preload()
        this.load.image('desk', 'assets/images/desk.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('chair_up', 'assets/images/chair_up.png');
        this.load.image('chair_down', 'assets/images/chair_down.png');
        this.load.image('sitShadow', 'assets/images/sitSghadow.png');
        this.load.image('sitText', 'assets/images/sitText.png');
        this.load.image('bookshelf', 'assets/images/book-shelf.png');
        this.load.image('book-side', 'assets/images/book-red.png');

        this.load.image('libraryTiles1', 'assets/map/libraryTiles1.png');
        this.load.image('libraryTiles2', 'assets/map/libraryTiles2.png');
        this.load.image('libraryTiles3', 'assets/map/libraryTiles3.png');
        this.load.tilemapTiledJSON('libraryMap', 'assets/map/libraryMap.json');
    }

    create() {
        this.createMap();    
        const worldWidth = 32*60;        
        const worldHeight = 32*60;
        super.create({x : worldWidth/2, y : worldHeight}, {x : 1000, y: 800}, {x : worldWidth, y: worldHeight});    
        this.setDeskCollider()
        this.setEventHandlers();
        this.socket.emit("initializeLibrary");
    }

    update() {
        super.update(); 
    }

    /** setEventHandlers
     * @description set event handlers     
     */
    setEventHandlers(){
        super.setEventHandlers()
        this.game.events.on('libraryToRest', () => {
            this.changeScene('Rest')
        })
        // Description
        // socket.on('event', eventHandler)
        this.socket.on('newArtifact', this.onNewArtifact.bind(this));
        // this.socket.on('newGroup', this.onNewGroup.bind(this))
        this.socket.on("RESPONSE_NEW_DONE_QUEST", this.onNewDoneQuest.bind(this));
        this.socket.on("RESPONSE_NEW_GROUP", this.onResponseNewGroup.bind(this));
        this.socket.on("RESPONSE_FRIEND_START_STUDY", this.onResponseFriendStartStudy.bind(this));
    }


    /** Create() Helper Functions  */

    createMap() {
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

        this.belowPlayer1.setDepth(-5);
        this.world1.setDepth(-5);      

        /** Create desks */
        this.deskPositions = [{x:500, y:450}, {x:1000, y:450}, {x:1500, y: 450}, {x:450, y:1250}, {x:1500, y:1250}, {x:450, y: 1650}, {x:1500, y: 1650}]
        this.bookshelfPositions = [{x:500, y:350}, {x:1000, y:350}, {x:1500, y: 350}]
        let deskIndex = 0
        this.deskPositions.forEach((position, index) =>{
            let bookshelf = this.createBookshelf(position.x, position.y, 'bookshelf');
            let desk = this.createDesk(position.x, position.y, 'desk', {down: 'chair_down', up :'chair_up'}, index);
            this.areas[index] = {desk : desk, bookshelf : bookshelf, groupID : null};
        })
    }

    /** createDesk
     * @parameter x, y, deskKey : spritekey for desk, chairkey : spritekey for chair
     * @return Desk : extends sprite, defined in entity/Desk.js
     */
    createDesk(x, y, deskKey, chairKey, index) {
        return new Desk(this, x, y, deskKey, chairKey, index);    
    }  

    createBookshelf(x, y, bookshelfKey) {
        return new Bookshelf(this, x, y, bookshelfKey);    
    }  

    setDeskCollider() {
        Object.keys(this.areas).forEach((value, i) =>{
            let desk = this.areas[i].desk;
            desk.getAll().forEach(sprite => {
                this.physics.add.collider(this.user, sprite);
            })
            let bookshelf = this.areas[i].bookshelf;
            this.physics.add.collider(this.user, bookshelf.bookshelf);
        })
    }

    /** assignGroupArea
     * @parameter deskId: id of desk to assign, groupId : to be implemented
     * 
     */
    assignGroupArea(groupID, groupNameText, colors){      
        if (Object.keys(this.groupToIndex).includes(groupID)){
            return;
        }
        const colorMain = colors[0];
        const colorInt = parseInt(colorMain.substr(1), 16);
        /** get Id of next desk prepared to be assigned */
        let deskId = this.nextdeskId;  
        if (this.areas === undefined){
            console.log("this.areas is undefined");
            return;
        }
        let desk = this.areas[deskId].desk;        

        /** Create Container, children = [border, groupName] */
        let container = this.add.container(desk.x, desk.y); 
        container.setSize(350, 350);        
        let border = this.add.rectangle(0, 0, container.width, container.height, colorInt, 0.1).setStrokeStyle(this.borderWidth, colorInt);
        let groupName = this.add.text(-container.width/2, container.height/2, groupNameText, { 
            fontSize: '16px', 
            fontFamily: 'Lato',
            color: colorMain,
            align:'center', });

        const allowed = groupID === this.loginUser.curGroup;
        
        desk.assignGroup(allowed, {groupID : groupID, groupName : groupNameText})
        this.groupToIndex[groupID] = deskId;

        groupName.setOrigin(0,1);
        container.add(border);
        container.add(groupName);
        container.setDepth(-5);
        this.nextdeskId += 1;

        /** Group border appears gradually based on tween (animation) */
        container.alpha = 0;
        const duration = 3000;
        let moveTween = this.tweens.add({
          targets : container,
          alpha: 1,
          ease: 'Sine.easeInOut',
          duration: duration,
          repeat : 0,
        })
        console.log("assignGroupArea")
    }

    onResponseFriendStartStudy(payload){
        const friend = this.createFriend(payload);
        console.log("onResponseFriendStartStudy(payload)", payload);
        if(friend){
          console.log("if(friend)", payload.deskIndex, payload.chairIndex);
          this.friendDictStudying[payload.loginUser.socketID] = friend;
          if ((payload.deskIndex !== undefined) && (payload.chairIndex !== undefined)){
            console.log("friend.sit()", this.areas[payload.deskIndex].desk, payload.chairIndex);
            friend.sit(this.areas[payload.deskIndex].desk, payload.chairIndex)
          }
          else{
            return
          }
        }
    }

    /** 
     * onNewDoneQuest
     * @param /bookList
    */
    onNewDoneQuest(response){
        const books = response.payload;
        console.log('onNewDoneQuest');
        if(this.areas === undefined){
            return;
        }
        this.areas.forEach((area, index)=>{
            let groupID = area.desk.group.groupID;
            if (Object.keys(books).includes(groupID)){
                let questList = books[groupID] 
                this.areas[index].bookshelf.updateBooks(questList);
                console.log('bookshelf.updateBooks called');
            }
        })
    }

    onResponseNewGroup(request){
        const {payload} = request;
        this.assignGroupArea(payload.groupID, payload.groupName, payload.colors)
    }  

    onNewArtifact(data){
        // console.log('recieve : newArtifact')
        
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let htmlModal = new HtmlModal(this, screenCenterX, screenCenterY, 'book-front', 'newArtifact');
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
              htmlModal.onArtifacthtmlModalClicked(this.nextBookPosition)
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
}
