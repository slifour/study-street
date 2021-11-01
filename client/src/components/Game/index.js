/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import React from 'react';

// Import your Scenes
import { HomeScene } from './scenes/HomeScene';
import FirstScene from './scenes/FirstScene';
import SecondScene from './scenes/SecondScene';

export default class Game extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
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
      scene: [HomeScene, FirstScene, SecondScene],
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
