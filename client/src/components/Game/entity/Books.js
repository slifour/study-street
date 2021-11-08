import Phaser from 'phaser';
import Book from './Book';
import Alert from './Alert';

export default class Books extends Phaser.GameObjects.Container {
  constructor(scene, x, y, bookX, id=0) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.bookX = bookX 
    this.prevMaxIndex = 3;   
    // let margin = -50;

    // this.bookshelf = this.scene.physics.add.image(0, margin, bookshelfKey);
    // this.scene.add.existing(this.bookshelf);
    // this.scene.physics.world.enable(this.bookshelf);
    // this.books = this.scene.add.container(0, 32);  
    // console.log() 
    // this.add(this.bookshelf)
    // this.setSize(this.bookshelf.displayWidth, this.bookshelf.displayHeight)
    // // this.bookPositions = this.getBookPositions(n, containerX+x, containerY+y-margin)    
  }

  updateBooks(sizeList, update = true){
    this.removeAll(true)
    let bookX = this.bookX;
    sizeList.forEach(function(size, i){
      console.log(size);
      let book = new Book(this.scene, bookX, 0, size)
      this.add(book)
      if (i > this.prevMaxIndex){
        let alert = new Alert(this.scene, this, '!');
        Phaser.Display.Align.To.TopCenter(alert, book, 0, -20)
        alert.setBook(book)
        book.setAlert(alert)
        book.startTween()
        this.add(alert)        
      }
      bookX += book.displayWidth;
      console.log(size, book.displayWidth)
    }.bind(this)) 
  }

  // getBookPositions(n, x, y){
  //   let bookDistance = this.Width/n 
  //   let bookX = x + bookDistance/2-this.Width/2
  //   let i;
  //   let positions = []
  //   for (i=0; i < n; i++){
  //       positions[i] = {'x': bookX, 'y':y}
  //       bookX += bookDistance
  //   }
  //   return positions;
  // }
}