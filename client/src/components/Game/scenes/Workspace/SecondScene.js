import MainScene from './MainScene';

export default class FirstScene extends MainScene{
  constructor() {
    super('SecondScene');  
  }
  create() {
    this.createHelper()
    //launch OpeningScene
    this.scene.launch('OpeningScene');
    this.scene.pause('Secondcene');

    this.input.on('pointerdown', function(){
      // this.scene.resume('OpeningScene');
      // this.scene.stop('SecondScene');
      // this.scene.launch('FirstScene');
   }, this);
  }
}