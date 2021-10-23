import { LibraryScene } from "./LibraryScene.js";

export class StudyScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'StudyScene'
    });
  }

  init() {
    this.scene.remove('Library');
    this.socket = this.registry.get('socket')    
    this.socket.emit('study')
    console.log('Welcome to StudyScene')    
  };  

  preload() {

    // this.load.image("library", "assets/map/library_small.png");
    this.load.image('tiles', 'assets/map/tiles1.png');
    this.load.image('chair', 'assets/images/chair.png');

    // map in json format
    this.load.tilemapTiledJSON('library', 'assets/map/library.json');

    this.load.spritesheet('user', 'assets/spritesheet_user.png', {
      frameWidth: 32,
      frameHeight: 32
    });

  }
  // Study Scene 으로 shift  }
  toLibraryScene(x, y) {    
    this.scene.add('Library', new LibraryScene());

    this.cameras.main.fadeOut(1000, 0, 0, 0)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        this.scene.start('Library');
    })        
}
  createChair() {   
    this.chair = this.physics.add.image(300, 350, 'chair');     
    this.chair.setInteractive().on('pointerdown', this.toLibraryScene.bind(this, this.chair.x, this.chair.y))       

  }

  create() {
    this.cameras.main.fadeIn(1000, 0, 0, 0)

    this.map = this.make.tilemap({
      key: 'library', tileWidth: 32, tileHeight: 32
    });

    var tileset = this.map.addTilesetImage('tiles', 'tiles');
    var layer = this.map.createStaticLayer('backgroundLayer', tileset, 0, 0)

    // don't go out of the map
    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;    

    this.createChair()

  }
  
  update() {

  }
}
