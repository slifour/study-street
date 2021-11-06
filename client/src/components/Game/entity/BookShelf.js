import Phaser from 'phaser';

export default class Bookshelf extends Phaser.GameObjects.Container {
  constructor(scene, x, y, bookshelfKey, n, containerX, containerY, id=0) {
    super(scene, x, y);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    
    let bookshelf = this.scene.physics.add.image(x, y, bookshelfKey).setScale(0.2);
    this.add(bookshelf)
    this.setSize(bookshelf.displayWidth, bookshelf.displayHeight)

    let margin = 10;
    this.bookPositions = this.getBookPositions(n, containerX+x, containerY+y-margin)    
  }

  getBookPositions(n, x, y){
    let bookDistance = this.Width/n 
    let bookX = x + bookDistance/2-this.Width/2
    let i;
    let positions = []
    for (i=0; i < n; i++){
        positions[i] = {'x': bookX, 'y':y}
        bookX += bookDistance
    }
    return positions;
  }
}
