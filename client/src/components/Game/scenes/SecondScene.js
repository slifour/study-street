import MapScene from './MapScene';

export default class SecondScene extends MapScene{
  constructor() {
    super('SecondScene');  
  }
  create() {
    console.log("SecondScene started")
    this.createHelper()
    //launch OpeningScene
    // this.scene.start('LoadScene');
    // this.scene.pause('LoadScene');    

    this.input.on('pointerdown', function(){
      this.scene.start('FirstScene')
      // console.log("FirstScene -> LoadScene. Input : pointerdown")
      // this.scene.resume('LoadScene');  
      // console.log("LoadScene resumed")
      // this.scene.stop('FirstScene');
   }, this);
  }
}