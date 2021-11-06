import Phaser from 'phaser';
import Desk from "./Desk";
import Bookshelf from "./Bookshelf";

export default class GroupArea extends Phaser.GameObjects.Container {
    constructor(scene, x, y, id = 0, color = '#ff0000', margin = 32) {
        console.log(scene, x, y)
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.id = id
        this.setSize(500, 500);      
        this.setScale(1, 1);
        this.margin = margin
        this.color = color
        this.x = x
        this.y = y
        this.borderWidth = 3 
        this.color = color
        console.log('New GroupArea:', x, y)        
    }

    init(deskKey, chairKey, bookshelfKey) {
        console.log('GroupArea.init():', deskKey, chairKey);        
        this.createBorder();
        this.createDesk(deskKey, chairKey);
        this.nextbookPosition = this.createBookShelf(bookshelfKey, this.x, this.y)
    }

    createDesk(deskKey, chairKey) {
        let margin = 50;
        console.log('GroupArea.createDesk():', deskKey, chairKey)
        let desk = new Desk(this.scene, 0, margin, deskKey, chairKey)
        this.add(desk)
    }  

    createBorder(){
        console.log('createBorder:', this.displayWidth, this.displayHeight)
        let border = this.scene.add.rectangle(0, 0, this. displayWidth, this.displayHeight);
        border.setStrokeStyle(this.borderWidth, this.color)
        this.add(border)
    }

    createBookShelf(bookshelfKey){
        let bookshelfMargin = -100;
        console.log('createBookShelft:', this.displayWidth, this.displayHeight)
        let bookshelf = new Bookshelf(this.scene, 0, bookshelfMargin, bookshelfKey, 3);
        this.add(bookshelf)
        this.positions = bookshelf.getBookPositions()
    }
  
  }