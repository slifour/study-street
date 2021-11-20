import GroupArea from '../entity/GroupArea';
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
        super.create();    
        this.setDeskCollider()
        this.setEventHandlers();
        this.socket.emit("initializeLibrary");
        let portalPosition = {x : this.world1.displayWidth/2, y : this.world1.displayHeight};
        portalPosition.x = 950;
        portalPosition.y = 1930;
        super.createPortal(portalPosition);
        this.assignGroupArea("a", "Team Slifour", ["ff0000"]);
    }

    update() {
        super.update(); 
    }

    /** setEventHandlers
     * @description set event handlers     
     */
     setEventHandlers(){
        super.setEventHandlers()
        // Description
        // socket.on('event', eventHandler)
        this.socket.on('newArtifact', this.onNewArtifact.bind(this));
        // this.socket.on('newGroup', this.onNewGroup.bind(this))
        this.socket.on("RESPONSE_NEW_DONE_QUEST", this.onNewDoneQuest.bind(this));
        this.game.events.on('libraryToRest', () => {
            this.changeScene('Rest')
        })
        this.socket.on("RESPONSE_NEW_GROUP", this.onResponseNewGroup.bind(this));
    }


    /** Create() Helper Functions  */

    /**
     * createGroupArea
     * @param groupKey : key to manage group areas
     */
    // createGroupArea(groupName, colors){
    //     let groupArea = new GroupArea(this, 500, 400)
    //     groupArea.init('desk', 'chair', 'bookshelf')
    //     // this.nextBookPosition = groupArea.positions[0]
    //     groupArea.setPosition(500, 400)
    //     this.groupAreas[groupKey] = groupArea
    // }

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

        // Group Area Example (Manual)
        // this.createGroupArea('a');

        // Create desks
        this.deskPositions = [{x:500, y:450}, {x:1000, y:450}, {x:1500, y: 450}, {x:500, y:1000}, {x:1000, y:2000}, {x:1500, y: 1000}, {x:1500, y: 2000}]
        this.bookshelfPositions = [{x:500, y:350}, {x:1000, y:350}, {x:1500, y: 350}]
        let deskIndex = 0
        this.deskPositions.forEach((position, i) =>{
            let bookshelf = this.createBookshelf(position.x, position.y, 'bookshelf');
            let desk = this.createDesk(position.x, position.y, 'desk', {down: 'chair_down', up :'chair_up'});
            this.areas[i] = {desk : desk, bookshelf : bookshelf, groupID : null};
        })

        // don't go out of the map
        // console.log(this.belowPlayer1.displayWidth, this.belowPlayer1.displayHeight)
        // console.log(this.world1.displayWidth, this.world1.displayHeight)
        // console.log(this.map.widthInPixels, this.map.heightInPixels)
        // this.physics.world.bounds.width = this.belowPlayer1.displayWidth;
        // this.physics.world.bounds.height = this.belowPlayer1.displayHeight;
        // this.cameras.main.setBounds(0, 0, this.belowPlayer1.displayWidth, this.belowPlayer1.displayHeight);
        // this.bufferToFirst = this.add.rectangle(this.map.displayWidth-this.bufferWidth/2, this.map.displayHeight/2, this.bufferWidth, this.map.displayHeight, 0xff0000);
        // this.physics.add.existing(this.bufferToFirst)
    }

    /** createDesk
     * @parameter x, y, deskKey : spritekey for desk, chairkey : spritekey for chair
     * @return Desk : extends sprite, defined in entity/Desk.js
     */
    createDesk(x, y, deskKey, chairKey) {
        return new Desk(this, x, y, deskKey, chairKey);    
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
        const colorMain = colors[0];
        /** get Id of next desk prepared to be assigned */
        let deskId = this.nextdeskId;  
        let desk = this.areas[deskId].desk;        

        /** Create Container, children = [border, groupName] */
        let container = this.add.container(desk.x, desk.y); 
        container.setSize(350, 350);        
        let border = this.add.rectangle(0, 0, container.width, container.height);
        console.log(groupNameText)
        let groupName = this.add.text(-container.width/2, container.height/2, groupNameText, { 
            fontSize: '16px', 
            fontFamily: 'Lato',
            color: colorMain,
            align:'center', });

        this.areas[deskId].groupID = groupID;
        this.groupToIndex[groupID] = deskId;

        groupName.setOrigin(0,1);
        border.setStrokeStyle(this.borderWidth, colorMain)
        console.log(container)
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

    /** toRestScene
     * @description move to rest scene     
     */
    changeScene(newScene, data){        
        super.changeScene(newScene, data);
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
            let groupID = area.groupID;
            console.log(area, index, groupID);
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
