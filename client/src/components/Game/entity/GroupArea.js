import Phaser from 'phaser';
import Desk from "./Desk";
import Books from "./Books";
import Book from './Book';

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
        this.createBookshelf(bookshelfKey);
        this.createBooks();
        Phaser.Display.Align.To.BottomLeft(this.books, this.bookshelf, -15, 5)
        this.createDesk(deskKey, chairKey);
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
    
    createBookshelf(bookshelfKey){
        let margin = -150;
        let bookshelf = this.scene.physics.add.image(0, margin, bookshelfKey).setScale(1, 1.2);
        // bookshelf.setSize(72);
        this.scene.add.existing(bookshelf);
        this.scene.physics.world.enable(bookshelf );
        this.add(bookshelf)
        this.coordinate = bookshelf.getBottomLeft()
        console.log(this.coordinate)
        this.bookshelf = bookshelf
    }

    createBooks(){
        let bookshelfMargin = -100;
        console.log('createBookShelf:', this.displayWidth, this.displayHeight, this.bookshelf.getBottomLeft());
        this.books = new Books(this.scene, 0, bookshelfMargin, 3);
        this.add(this.books)
    }

    updateBooks(value){
        console.log('GroupArea.updateBooks(',value, ')')
        for (const [shelfId, sizeList] of Object.entries(value)) {
            if (shelfId == 0) {
                this.books.updateBooks(sizeList)
                // let height = 32*Number(shelfId)
                // let books = this.scene.add.container(this.x, this.y + height);                
                // this.scene.add.existing(books);
                // this.scene.physics.world.enable(books);
                // books.setSize(300,300)
                // let bookX = this.x
                // console.log(this.y)
                // for (const size of sizeList){
                //     console.log(size);
                //     this.scene.book = new Book(this.scene, bookX, this.y + height, size)
                //     // this.add(book)
                //     // books.add(book)
                //     bookX += size
                // }
                // this.add(books)
                // this.bookshelf.removeAt(0, true);
                // books.setSize(this.bookshelf.width, this.bookshelf.height)
                // books.setSize(this.bookshelf.width, this.bookshelf.height)
                // this.bookshelf.add(books);             
                // console.log(this.bookshelf.getAll())   
            }           
        }  
    } 

  }