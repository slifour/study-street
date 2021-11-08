/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import React from 'react';

// Import your Scenes
import { HomeScene } from './scenes/HomeScene';
import Library from './scenes/LibraryScene' ;
import Rest from './scenes/RestScene';

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
      scene: [Library, Rest],
      // scene: [HomeScene, Library, Rest],
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
}
