import Phaser from 'phaser';
import Books from "./Books";
import Book from './Book';

export default class Bookshelf extends Phaser.GameObjects.Container {
    constructor(scene, x, y, bookshelfKey) {
        console.log(scene, x, y)
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.x = x
        this.y = y      
        this.createBookshelf(bookshelfKey);
        this.createBooks();
        Phaser.Display.Align.To.BottomLeft(this.books, this.bookshelf, -15, 5)
    }

    init(bookshelfKey) {     

    }

    createBookshelf(bookshelfKey){
        let margin = -150;
        this.bookshelf = this.scene.physics.add.image(0, margin, bookshelfKey).setScale(1, 1.2);
        // bookshelf.setSize(72);
        this.scene.add.existing(this.bookshelf);
        this.scene.physics.world.enable(this.bookshelf);
        this.add(this.bookshelf)
        this.coordinate = this.bookshelf.getBottomLeft()
    }

    createBooks(){
        let bookshelfMargin = -100;
        console.log('createBookShelf:', this.displayWidth, this.displayHeight, this.bookshelf.getBottomLeft());
        this.books = new Books(this.scene, 0, bookshelfMargin, 3);
        this.add(this.books)
    }

    updateBooks(questList){
        this.books.updateBooks(questList)
        console.log('GroupArea.updateBooks(',questList, ')')
        // for (const [shelfId, sizeList] of Object.entries(value)) {
        //     if (shelfId == 0) {
        //         this.books.updateBooks(sizeList)
        //         // let height = 32*Number(shelfId)
        //         // let books = this.scene.add.container(this.x, this.y + height);                
        //         // this.scene.add.existing(books);
        //         // this.scene.physics.world.enable(books);
        //         // books.setSize(300,300)
        //         // let bookX = this.x
        //         // console.log(this.y)
        //         // for (const size of sizeList){
        //         //     console.log(size);
        //         //     this.scene.book = new Book(this.scene, bookX, this.y + height, size)
        //         //     // this.add(book)
        //         //     // books.add(book)
        //         //     bookX += size
        //         // }
        //         // this.add(books)
        //         // this.bookshelf.removeAt(0, true);
        //         // books.setSize(this.bookshelf.width, this.bookshelf.height)
        //         // books.setSize(this.bookshelf.width, this.bookshelf.height)
        //         // this.bookshelf.add(books);             
        //         // console.log(this.bookshelf.getAll())   
        //     }           
        // }  
    } 
}