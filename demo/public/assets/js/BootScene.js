import { LibraryScene } from "./LibraryScene.js";
export class BootScene extends Phaser.Scene {
    constructor() {
      super();
    } 

    preload() {

    }
  
    create(i) {
      console.log('Welcome to BootScene', i);
      const socket = io();
      var counter = 0;          

      let key = 'Library' + counter;
      counter++;
      let libraryScene = new LibraryScene(key);
      this.scene.add(key, libraryScene);
      this.scene.start('LibraryScene', counter)
      // , { counter : counter, socket : socket, prevScene : 'Boot'});    
    }

    update() {

    }
}

// module.exports = {
//     BootScene
// };