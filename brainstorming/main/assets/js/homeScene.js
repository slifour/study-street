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

    invitationCome() {
        throw { name: "NotImplementedError" };
    }

    /* Access the home stage and build a group */
    
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

    /* 서버에서 업데이트를 받으면 자동으로 실행되는 함수 이름은 `on`으로 시작하도록 했어요. */
    /* Map을 구성할 때 쓰는 함수 이름은 `create`로 시작하도록 했어요. */
    /* React를 써서 UI로 구현될 것 같은 함수에는 `- UI 함수`라고 써뒀어요! */


    /**  씬 전환 
    */
    toLibraryScene() {

    }

    /** 움직이기
     */
    updateMovement() {

    }
    


    /**######################################################################
     * 서버에서 받은 업데이트 반영하기
    ######################################################################*/
    
    /* 서버에서 업데이트를 받으면 자동으로 실행되는 함수 이름은 `on`으로 시작하도록 했습니다! */

    /**  새로운 그룹 목표가 달성 되었을 때  
     * -> Tooltip 또는 애니메이션 생성
     * @ param 달성한 목표 제목,
     * @ return .  
     * @ task 2
     */
    onNewGroupArtifact(artifact) {
        throw { name: "NotImplementedError" };
    }

    /**  새로운 '그룹으로 초대'가 왔을 때 
     * @ task 2
     */
    onInvitationCome() {
        throw { name: "NotImplementedError" };
    }

    /**######################################################################
     * 그룹 구성하기
    ######################################################################*/

    /** 사용자에게 온 '그룹으로 초대' 보여주기  
     * UI 함수
     * @ task 2
     */
    listInvitation() {

    }

    /** '그룹으로 초대' 수락하기  
     * @ param 수락할 초대
     * @ task 2
     */
    confirmInvitation(invitation) {
        throw { name: "NotImplementedError" };
    }

    /** 가입한 그룹 모두 보여주기  
     * UI 함수
     * @ task 2
     */
    listParticipatedGroup() {
        throw { name: "NotImplementedError" };
    }

    /** 새로운 그룹 만들기
     * - UI 함수  
     * @ param 수락할 초대
     * @ task 2
     */
    makeNewGroup() {
        throw { name: "NotImplementedError" };
    }

    /** 그룹에 새로운 멤버를 초대하기 위해 멤버 정보 (일단 ID)를 입력
     * -> sendInvitation를 호출해 초대를 받을 사용자에게 '그룹으로 초대' 메시지가 감.
     * - UI 함수
     * @ task 2
     */
    inviteMember() {
        throw { name: "NotImplementedError" };
    }

    /** 그룹에 새로운 멤버 초대하기
     * -> 초대를 받을 사용자에게 '그룹으로 초대' 메시지가 감.
     * @ param 초대할 그룹, 초대를 받을 사람
     * @ task 2
     */
    sendInvitation(group, member) {
        throw { name: "NotImplementedError" };
    }

    /** 그룹에 있는 멤버들 보여주기
     * - UI 함수
     * @ param 확인할 그룹
     * @ task 2
     */
    listMember(group) {
        throw { name: "NotImplementedError" };
    }

    /**######################################################################
     * 그룹 목표 달성하고 확인하기
    ######################################################################*/

    /** 지금까지 그룹 목표를 달성해 받은 아티팩트를 보여주기 
     * @ param 보여줄 그룹
     * @ task 2
     */    
    createGroupArtifacts(group) {
        throw { name: "NotImplementedError" };
    }

    /** 지금까지 그룹이 공부한 통계를 보여주기 
     * -> 공부한 시간 총합, 목표 달성 현황
     * - UI 함수
     * @ param 보여줄 그룹
     * @ task 2
     */ 
    groupStatistics(group) {
        throw { name: "NotImplementedError" };
    }

    /** 그룹 체크리스트를 보여주기 
     * -> 목표 달성을 위해 필요
     * - UI 함수
     * @ param 보여줄 그룹
     * @ task 2
     */ 
    groupChecklist(group) {
        throw { name: "NotImplementedError" };
    }

    // setGroupGoal ? 

    /** 그룹 채팅방을 보여주기 
    */
    groupChat() {
        throw { name: "NotImplementedError" };
    }
}