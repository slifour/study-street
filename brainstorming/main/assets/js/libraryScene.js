/** Module 설명은 여기에 
 * (Phaser 3.) 
 * Phaser에서 하나의 게임 화면을 Scene Class 로 정의해서 묶고 전환합니다. 
 */ 

/**
 * function() brainstorming 관련
 * - 아래 exampleFunction() 복붙해서 활용해주세요.
 * - @ param @ return 항목은 실제 구현하는 사람이 결정할테니까 꼭 채우려하지말고 필요한 경우에만 간단하게 적어주시면 될 것 같습니다.  
 * - 여유가 되면 task랑 직접 관련 있는 함수들은 @ task 에 번호를 적어두면 작성한 feature 리스트랑 쉽게 매치할 방법을 찾아볼 수 있을 것 같아요.
 *      ex. updatePostIt() @ task 1 
 *          createArtifact() @ task 2
 *          goToRest() @ task 3
 *          moveUser() @ task (적을필요없음)
 */

class LibraryScene extends Phaser.Scene {
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
     * 서버에서 받은 업데이트 반영하기
    ######################################################################*/

    /**
     * Other가 도서관으로 올 때
     * -> other 의 아바타 생성
     * @ param other의 정보
     * @ return . 
     * @ task 
     */        
    otherCome(user) {
        throw { name: "NotImplementedError" };
    };

    /**
     * Other가 공부 시작할 때 
     * -> other 돌아올 때 까지 앉혀놓고 타이머 돌리기
     * @ param other의 정보,
     * @ return . 
     * @ task  
     */    
    otherStudy(user, chairId) {
        throw { name: "NotImplementedError" };
    };

    /**
     * Other가 쉬러 갔을 때 
     * -> other 아바타 삭제
     * @ param other의 정보,
     * @ return .  
     * @ task 
     */    
    otherRest(user) {
        throw { name: "NotImplementedError" };
    };

    /**
     * 새로운 그룹 목표가 달성 되었을 때  
     * -> Tooltip 또는 애니메이션 생성
     * @ param 달성한 목표 제목,
     * @ return .  
     * @ task 
     */    
    newGroupArtifact(artifact) {
        throw { name: "NotImplementedError" };
    }

    /**
     * 공부 중인 other가 status 변경 했을 때   
     * -> Tooltip 또는 애니메이션 생성
     * @ param other 정보, 새로운 status 이름
     * @ return .  
     * @ task 
     */    
    otherStatus() {
        throw { name: "NotImplementedError" };
    }

    /** ######################################################################
     * User가 할 수 있는 일시적 Event들 + 그 Event에서 서버에 알려하는 것 알리기
    ######################################################################*/ 

    /**
     * Study Scene으로 이동
     * @ call 의자 클릭 했을 떄
     * @ param 클릭한 의자 id 또는 위치
     * @ return .  
     * @ task 
     */    
    toStudyScene() {  
        throw { name: "NotImplementedError" };      
    }
    emitStudy() {    
        throw { name: "NotImplementedError" };    
    };

    /**
     * Rest Scene으로 이동
     * @ call 맵 끝을 넘어갈 때 
     * @ param
     * @ return .  
     * @ task 
     */    
    toRestScene() {
        throw { name: "NotImplementedError" };
    };
    emitRest() {
        throw { name: "NotImplementedError" };
    };

    /**######################################################################
     * 실시간으로 Update 되야 하는 것
    ######################################################################*/
    updateMovement() {
        throw { name: "NotImplementedError" };
    }

    emitMovement() {
        throw { name: "NotImplementedError" };
    }


    /**#############################################################################
     * Map 구성할 때 따로 작성해서 사용할 함수들 (이건 brainstorming 안하고 구현하는 사람이 알아서 해도 될 것 같습니다!)
    ###############################################################################*/    

    createMap() {
        throw { name: "NotImplementedError" };
    }

    createAnimations() {
        throw { name: "NotImplementedError" };
    }

    createGroupArea() {
        throw { name: "NotImplementedError" };
    }

    createGroupArtifacts() {
        throw { name: "NotImplementedError" };
    }

    createDesk() {
        throw { name: "NotImplementedError" };
    }

    createChair() {    
        throw { name: "NotImplementedError" };  
    }

    handleCloseToChair() {
        throw { name: "NotImplementedError" };
    }

    createUser(userInfo) {
        throw { name: "NotImplementedError" };
    }

    addOtherUsers(userInfo) {
        throw { name: "NotImplementedError" };
    }

    updateCamera() {
        throw { name: "NotImplementedError" };
    }

    /**
     * key event input
     * character 이동, animation
     * @ param
     * @ return
     * @ task 1
     */        
    moveLeft() {
        throw { name: "NotImplementedError" };
    };
    moveRight() {
        throw { name: "NotImplementedError" };
    };
    moveUp() {
        throw { name: "NotImplementedError" };
    };
    moveDown() {
        throw { name: "NotImplementedError" };
    };

    /**
     * 상대방에 가까이 다가갔을 때(혹은 그룹 공간에 들어갔을 때)
     * Avatar 위에 Status를 띄움
     * @ param user
     * @ return ReactComponent
     * @ task 1
     */        
     statusOnAvatar(user) {
        throw { name: "NotImplementedError" };
    };

    /**
     * 의자 근처에 다가갔을 때
     * 의자 Click 유도하는 effect 출력
     * @ param chair
     * @ return
     * @ task 1
     */        
     showChairClickBait(chair) {
        throw { name: "NotImplementedError" };
    };

    //여러 Scene에서 사용되는 Entities, UI 구성 요소들은 별개의 Component로 구성하는 것이 더 좋을 듯!
    
    ////Playlist
    /**
     * playlist의 switch 클릭
     * playlist를 켜고 끔
     * @ param
     * @ return
     * @ task 1
     */        
     switchPlaylist() {
        throw { name: "NotImplementedError" };
    };

    ////Icon
    /**
     * icon update
     * @ param icons, status
     * @ return
     * @ task 1
     */        
     updateIcons(info) {
        throw { name: "NotImplementedError" };
    };

    /**
     * icon hover
     * icon 옆에 status를 띄움
     * @ param icon
     * @ return ReactComponent
     * @ task 1
     */        
     statusOnIcon(icon) {
        throw { name: "NotImplementedError" };
    };

    /**
     * icon click
     * icon 옆에 dropdown 메뉴를 띄움
     * @ param icon
     * @ return ReactComponent
     * @ task 1
     */        
     dropmenuOnIcon(icon) {
        throw { name: "NotImplementedError" };
    };

    /**
     * icon dropmenu의 move to group space(user) click
     * user나 group space로 이동
     * @ param user(group)
     * @ return
     * @ task 1
     */        
     moveToUser(user) {
        throw { name: "NotImplementedError" };
    };

    //////Menu Bar
    ////Chat
    /**
     * Icon dropmenu의 chat 클릭
     * chat 화면에 출력
     * @ param user(혹은 group)
     * @ return ReactComponent
     * @ task 1
     */        
    chat(user) {
        throw { name: "NotImplementedError" };
    };
    
    writeMsg(string) {
        throw { name: "NotImplementedError" };
    };
    sendMsg(string) {
        throw { name: "NotImplementedError" };
    };
    receiveMsg(string) {
        throw { name: "NotImplementedError" };
    };

    ////Checklist
    /**
     * menu bar의 checklist icon click
     * checklist 화면에 출력
     * @ param
     * @ return ReactComponent
     * @ task 2
     */        
     checklist() {
        throw { name: "NotImplementedError" };
    };

    /**
     * checklist tab 전환
     * @ param
     * @ return
     * @ task 2
     */        
     switchTab() {
        throw { name: "NotImplementedError" };
    };

    /**
     * checklist todo CRUD
     * Create read update delete
     * @ param string, (todo component)
     * @ return
     * @ task 2
     */        
    createTodo(string) {
        throw { name: "NotImplementedError" };
    };
    updateTodo(todo, string) {
        throw { name: "NotImplementedError" };
    };
    deleteTodo(todo) {
        throw { name: "NotImplementedError" };
    };
    checkTodo(todo) {
        throw { name: "NotImplementedError" };
    };
    
}