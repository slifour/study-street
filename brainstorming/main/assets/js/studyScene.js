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


class StudyScene extends Phaser.Scene {
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

    /** ######################################################################
     * User가 할 수 있는 일시적 Event들 + 그 Event에서 서버에 알려하는 것 알리기
    ######################################################################*/ 

    /**
     * 체크리스트에서 status 등록
     * @ call 체크리스트의 할 일을 클릭했을 때 (임시 - 추가 논의 예정)
     * @ param 클릭한 할 일 목록
     * @ return .  
     * @ task 
     */    
    showStatus() {  
        throw { name: "NotImplementedError" };      
    }

    /**
     * 할 일 완료하기
     * @ call 체크리스트의 체크박스를 클릭했을 때
     * @ param 체크박스
     * @ return .  
     * @ task 
     */    
    clickCheckBox() {  
        throw { name: "NotImplementedError" };      
    }

/**
     * 다른 사람들의 활동 상태 확인하기
     * @ call 그룹원 프로필 위에 hover할 때
     * @ param 프로필, other의 정보
     * @ return .  
     * @ task 
     */    
 chcekOtherStatus() {  
    throw { name: "NotImplementedError" };      
}

/**
     * 타이머 작동
     * @ call 타이머 시작 / 정지 / 리셋? -> api
     * @ param
     * @ return .  
     * @ task 
     */    
 controlTimer() {  
    throw { name: "NotImplementedError" };      
}

/**
     * 포스트잇 알림 수신하기
     * @ call 유저 액션 없음, 상단 배너 알림
     * @ param 
     * @ return .  
     * @ task 
     */    
 receivePostIt() {  
    throw { name: "NotImplementedError" };      
}

/**
     * 포스트잇 내용 확인하기
     * @ call 유저가 상단 배너 알림을 클릭했을 때
     * @ param 포스트잇 알림
     * @ return .  
     * @ task 
     */    
 checkPostIt() {  
    throw { name: "NotImplementedError" };      
}

/**
     * 포스트잇에 답장하기
     * @ call reply 버튼
     * @ param 
     * @ return .  
     * @ task 
     */    
 replyPostIt() {  
    throw { name: "NotImplementedError" };      
}

/**
     * 포스트잇 전송 및 창 위로 보내기
     * @ call send버튼
     * @ param 체크박스
     * @ return .  
     * @ task 
     */    
 sendPostIt() {  
    throw { name: "NotImplementedError" };      
}

    /**
     * 나가기 = Library Scene으로 이동
     * @ call 나가기 버튼을 눌렀을 때
     * @ param 
     * @ return .  
     * @ task 
     */    
    toLibraryScene() {  
        throw { name: "NotImplementedError" };      
    };
    emitLibrary() {    
        throw { name: "NotImplementedError" };    
    };
}