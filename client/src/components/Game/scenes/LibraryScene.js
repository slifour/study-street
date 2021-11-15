import GroupArea from '../entity/GroupArea';
import Desk from '../entity/Desk';
import Tooltip from '../entity/Tooltip';
import Book from '../entity/Book';
import MapScene from './MapScene';

export default class Library extends MapScene {
    constructor() {
      super('Library');
    }

    init() {
        super.init();              
        this.bufferWidth = 10
        this.firstOverlap = true 
        this.groupAreas = {};      
        this.desks = {}
        this.borderWidth = 3  
    };

    preload() {
        super.preload()
        this.load.image('desk', 'assets/images/desk_4.png');
        this.load.image('chair', 'assets/images/chair.png');
        this.load.image('sitShadow', 'assets/images/sitShadow.png');
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
        let x = this.world1.displayWidth/2;
        let y = this.world1.displayHeight;
        x = 1000;
        y = 250;
        super.createPortal(x, y);
        this.assignGroupArea(2);
    }

    update() {
        this.user.update(this.cursors);
        Object.values(this.friendDict).forEach(friend => {friend.update();});
    }

    /** setEventHandlers
     * @description set event handlers     
     */
     setEventHandlers(){
        super.setEventHandlers()
        // Description
        // socket.on('event', eventHandler)
        this.socket.on('newArtifact', this.onNewArtifact.bind(this));
        this.socket.on('newGroup', this.onNewGroup.bind(this))
        this.socket.on("goalUpdate", this.onGoalUpdate.bind(this));
        this.game.events.on('libraryToRest', () => {
            this.changeScene('Rest')
        })
    }


    /** Create() Helper Functions  */

    /**
     * createGroupArea
     * @param groupKey : key to manage group areas
     */
    createGroupArea(groupKey){
        let groupArea = new GroupArea(this, 500, 400)
        groupArea.init('desk', 'chair', 'bookshelf')
        // this.nextBookPosition = groupArea.positions[0]
        groupArea.setPosition(500, 400)
        this.groupAreas[groupKey] = groupArea
    }

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

        // Group Area Example (Manual)
        this.createGroupArea('a');

        // Create desks
        this.deskPositions = [{x:500, y:450}, {x:1000, y:450}, {x:1500, y: 450}]
        let deskIndex = 0
        this.deskPositions.forEach(position =>{
            let desk = this.createDesk(position.x, position.y, 'desk', 'chair');
            this.desks[deskIndex] = desk;
            deskIndex += 1;  
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

    setDeskCollider() {
        Object.keys(this.desks).forEach(key =>{
            let desk = this.desks[key];
            desk.getAll().forEach(sprite => {
                this.physics.add.collider(this.user, sprite);
            })
        })
    }

    /** assignGroupArea
     * @parameter deskId: id of desk to assign, groupId : to be implemented
     * 
     */
    assignGroupArea(deskId){        
        let desk = this.desks[deskId];
        let container = this.add.container(desk.x, desk.y); 
        container.setSize(350, 300);        
        let border = this.add.rectangle(0, 0, container.width, container.height);
        border.setStrokeStyle(this.borderWidth, 0xff0000)        
        border.setDepth(-100);
        container.add(border);
        // container.add(desk)
    }

    /** toRestScene
     * @description move to rest scene     
     */
    changeScene(newScene, data){        
        super.changeScene(newScene, data);
    }
    
    /** 
     * onGoalupdate
     * @param bookList
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
}
