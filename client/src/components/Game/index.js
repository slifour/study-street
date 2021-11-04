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
      width: 910,
      height: 910,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        },
      },
      scale: {
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      },
      // scene: [HomeScene, Library, Rest],
      scene: [HomeScene, Library, Rest],
    };
    const game = new Phaser.Game(config);
    game.registry.set('socket', )
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="phaser-game" />;
  }
}
