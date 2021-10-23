/**###################################################################
 * Module 설명 여기에
######################################################################
 * (Phaser 3.) 
 * Phaser에서 하나의 게임 화면을 Scene Class 로 정의해서 묶고 Scene 사이를 전환합니다. 
 */ 

/**###################################################################
 * Function Description 관련
######################################################################
 * - 첫 번째 exampleFunction() 주석이랑 같이 복붙해서 활용해주세요.
 * - @ param 항목은 실제 구현하는 사람이 결정할테니까 꼭 채우려하지말고 필요한 경우에만 간단하게 적어주시면 될 것 같습니다.  
 * - @ return 은 쓸 일이 거의 없을 것 같습니다.
 * - 여유가 되면 task랑 직접 관련 있는 함수들은 @ task 에 번호를 적어두면 작성한 feature 리스트랑 쉽게 매치할 방법을 찾아볼 수 있을 것 같아요.
 *      ex. updatePostIt() @ task 1 
 *          createArtifact() @ task 2
 *          goToRest() @ task 3
 *          moveUser() @ task (적을필요없음)
 */
 
/**Example.*/

class Example{
    /**######################################################################
     * 서버에서 받은 업데이트 반영하기
    ######################################################################*/
    
    /**  새로운 그룹 목표가 달성 되었을 때  
     * -> Tooltip 또는 애니메이션 생성
     * @ param 달성한 목표 제목,
     * @ return .  
     * @ task 2
     */    
    newGroupArtifact(artifact) {
        throw { name: "NotImplementedError" };
    }
}


class HomeScene extends Phaser.Scene {
    constructor() {
        super();
    }

    init() {
        console.log('Welcome to LibraryScene');
    };

    preload() {
    }

    create() {        
    }    

    update() {        
    } 

    /**######################################################################
     * 분류
    ######################################################################*/

    /**     
     * @ param 
     * @ return 
     * @ task  
     */     
    exampleFunction() {
        throw { name: "NotImplementedError" };
    };

}