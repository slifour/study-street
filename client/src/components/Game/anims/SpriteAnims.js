import Phaser from "phaser";

/** @param {Phaser.Animations.AnimationManager} anims */ 
export function createSpriteBook(anims) {
  anims.create({
    key: 'book-turn',
    frames: anims.generateFrameNumbers('book', {frames: [Array(42).keys()]}),
    frameRate: 21,
    repeat: -1
  });
}