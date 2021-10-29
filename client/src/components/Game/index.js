/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import React from 'react';

// Import your Scenes
import MainScene from './scenes/MainScene';
import OpeningScene from './scenes/OpeningScene';
import { LibraryScene } from './scenes/LibraryScene';

export default class Game extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true, // set to true to view zones
        },
      },
      scale: {
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      },
      scene: [LibraryScene],
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
