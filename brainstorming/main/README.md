# study-street



## Project Directory

```
main
├── assets
│   ├── css
│   ├── images
│   ├── js
│   	├── homeScene.js
│   	├── libraryScene.js
│   	├── restScene.js
│   	└── studyScene.js
│   └── map│
├── node_modules│   	
├── index.html
└── README.md
```

## Function Brainstorming Guide (10/21)

- **가이드나 양식 꼭 사용할 필요 없이 가장 편한 방법으로 작성하고 공유하면 됩니다.**

- 첫 번째 exampleFunction()의 주석이랑 같이 복붙해서 활용해주세요.

- @param 항목은 실제 구현하는 사람이 결정할테니까 꼭 채우려하지말고 필요한 경우에만 간단하게 적어주시면 될 것 같습니다.  

- @return 은 쓸 일이 거의 없을 것 같습니다.

- 여유가 되면 task랑 직접 관련 있는 함수들은 @ task 에 번호를 적어두면 작성한 feature 리스트랑 쉽게 매치할 방법을 찾아볼 수 있을 것 같아요.

```
 updatePostIt() @ task 1 
 createArtifact() @ task 2
 goToRest() @ task 3
 moveUser() @ task (적을필요없음)
```
```javascript
/**Example.*/
/**#############################################
* 서버에서 받은 업데이트 반영하기  
* #############################################*/ 


/**  새로운 그룹 목표가 달성 되었을 때  
 * -> Tooltip 또는 애니메이션 생성
 * @ param 달성한 목표 제목,
 * @ return .  
 * @ task 2
 */
newGroupArtifact(artifact) {
    throw { name: "NotImplementedError" };
}
```
