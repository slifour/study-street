1. npm install 
2. node app.js 
game -> BootScene -> LibraryScene -> StudyScene -> LibraryScene 순서로 전환됩니다.
 
libraryscene으로 다시 돌아오면 항상 문제가 생겨요.
전환 될 때 이전 phaser scene이 제대로 종료 안되고 update가 돌고 있어서 생기는 문제인 것 같아서 
1. phaser 의 scene manager 로 해결하려고 해봤는데 잘 안되고 
2. socket을 인수로 계속 전달받는 문제인가 싶어서 인수로 안 주고 this.registry로 global하게 접근하게 해봤는데
libraryscene 으로 돌아오면 문제가 생깁니다.   
  
reference. 
https://phasertutorials.com/how-to-create-a-phaser-3-mmorpg-part-1/
https://phasertutorials.com/how-to-create-a-phaser-3-mmorpg-part-2/
https://phasertutorials.com/how-to-create-a-phaser-3-mmorpg-part-3/
