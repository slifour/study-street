import MainScene from './MainScene';

export default class FirstScene extends MainScene{
  constructor() {
    super('FirstScene');  
  }
  create() {
    this.createHelper()
    //launch OpeningScene
    this.scene.launch('OpeningScene');
    this.scene.pause('FirstScene');

    this.input.on('pointerdown', function(){
      this.scene.resume('OpeningScene');
      this.scene.pause('FristScene');      
      this.scene.resume('SecondScene');
   }, this);
  }
}
