/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import React from 'react';

// Import your Scenes
import Library from './scenes/LibraryScene' ;
import Rest from './scenes/RestScene';
import Study from './scenes/StudyScene';

export default class Game extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,  
        // width: 910,
        // height: 910,
      },
      backgroundColor: '#000000',
      scene: [Library, Study, Rest],
      dom: {
          createContainer: true
      },
    };
    this.game = new Phaser.Game(config);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="phaser-game" />;
  }
  emit(data){
    this.game.events.emit(data);
  }
}
