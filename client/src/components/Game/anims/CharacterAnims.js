import Phaser from "phaser";

/** @param {Phaser.Animations.AnimationManager} anims */ 
export function createCharacterAnimsWizard(anims) {
  //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
  anims.create({
    key: 'user-idle-wizard',
    frames: anims.generateFrameNumbers('user-wizard', { frames: [0, 15, 0, 16] }),
    frameRate: 2,
    repeat: -1
  });

  anims.create({
    key: 'user-down-wizard',
    frames: anims.generateFrameNumbers('user-wizard', { frames: [0] }),
    frameRate: 1,
    repeat: -1
  });

  anims.create({
    key: 'user-left-wizard',
    frames: anims.generateFrameNumbers('user-wizard', { frames: [8, 9, 10, 11, 12, 13, 14, 15] }),
    frameRate: 8,
    repeat: -1
  });

  anims.create({
    key: 'user-right-wizard',
    frames: anims.generateFrameNumbers('user-wizard', { frames: [16, 17, 18, 19, 20, 21, 22, 23] }),
    frameRate: 8,
    repeat: -1
  });

  anims.create({
    key: 'user-up-wizard',
    frames: anims.generateFrameNumbers('user-wizard', { frames: [4, 5, 6, 7] }),
    frameRate: 4,
    repeat: -1
  });
};

/** @param {Phaser.Animations.AnimationManager} anims */ 
export function createCharacterAnimsGirl(anims) {
  //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
  anims.create({
    key: 'user-idle-girl',
    frames: anims.generateFrameNumbers('user-girl', {frames: [1]}),
    frameRate: 1,
    repeat: -1
  });
  anims.create({
    key: 'user-down-girl',
    frames: anims.generateFrameNumbers('user-girl', { frames: [0, 1, 0, 2] }),
    frameRate: 10,
    repeat: -1
  });

  anims.create({
    key: 'user-left-girl',
    frames: anims.generateFrameNumbers('user-girl', { frames: [3, 4, 3, 5] }),
    frameRate: 10,
    repeat: -1
  });

  anims.create({
    key: 'user-right-girl',
    frames: anims.generateFrameNumbers('user-girl', { frames: [6, 7, 6, 8] }),
    frameRate: 10,
    repeat: -1
  });

  anims.create({
    key: 'user-up-girl',
    frames: anims.generateFrameNumbers('user-girl', { frames: [9, 10, 9, 11] }),
    frameRate: 10,
    repeat: -1
  });
}