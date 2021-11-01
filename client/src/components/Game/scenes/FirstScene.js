import MapScene from './MapScene';

export default class FirstScene extends MapScene{
  constructor() {
    super('FirstScene');  
  }
  create() {
    console.log("FirstScene started")
    this.createHelper()
    //launch OpeningScene
    // this.scene.start('LoadScene');
    // this.scene.pause('LoadScene');    

    this.input.on('pointerdown', function(){
      this.scene.start('SecondScene')
      // console.log("FirstScene -> LoadScene. Input : pointerdown")
      // this.scene.resume('LoadScene');  
      // console.log("LoadScene resumed")
      // this.scene.stop('FirstScene');
   }, this);
  }
}
