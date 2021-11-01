/** @type {import("../typings/phaser")} */
import Phaser from 'phaser';
import React from 'react';

// Import your Scenes
import MainScene from './scenes/MapScene';
import OpeningScene from './scenes/OpeningScene';
import FirstScene from './scenes/FirstScene';
import SecondScene from './scenes/SecondScene';
import LoadScene from './scenes/LoadScene';

export default class Game extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1500 },
          debug: false,
        },
      },
      scale: {
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      },
      scene: [FirstScene, SecondScene],
    };
    new Phaser.Game(config);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return <div id="phaser-game" />;
  }
}
