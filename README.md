# study-street

## Dependencies

> 제가 테스트하면서 사용한 버전이에요!

- Node v14.18.1
- Browser: Chrome

## Install

- Server
    - At the root directory
    - `cd server`
    - `npm install`
- Client
    - At the root directory
    - `cd client`
    - `npm install`

## Run

- [Updated]
- Concurrently
    - At the root directory
    - `cd server`
    - `npm run dev`

- [Outdated]
- Server
    - At the root directory
    - `cd server`
    - `node app.js`
- Client
    - At the root directory
    - `cd client`
    - `npm start`

## Deploy

> Deploy: 우리가 만든 작업물을 실제 서버에 올리는 일을 deploy라고 합니다
> Note -- Deploy는 제출 전에만 하면 되니 지금 너무 신경쓰실 필요는 없을 것 같아요! 

- 실행하세요
    0. 아래 스크립트는 모두 Unix (Linux / macOS) 환경에서 실행하세요. Git bash 환경에서도 아마 될 것 같아요. 
    1. `./build.sh`
        이 스크립트는 deploy할 파일을 만들어 `deploy/client-deploy` 와 `deploy/server-deploy`에 복사해요.
        이 두 폴더는 각각 server와 client의 Heroku용 repository와 연결되어 있어요. 
    2. 빌드한 것을 서버에 올리기 위한 작업은 `deploy/README.md`를 확인하세요.  

- 참고하세요
    `deploy/build-files`
    이 폴더에는 Procfile을 포함한 Heroku 관련 설정이 들어있어요



## What the program do

- React ↔ Phaser
    - Phaser 컨테이너가 `<Game />` 컴포넌트로 `App.js` 에 들어가 있다.
- React ↔ Socket io
    - Socket io를 이용해 서버 시간을 받아와 보여주는 컴포넌트가 `<ClientComponent />` 컴포넌트로 `App.js` 에 들어가 있다.
- Socket io ↔ Phaser


# 판단 기준

> 이런 것들을 고려하려고 노력했어요! 지금 버전이 기준과 맞지 않는 부분이 있더라도 나중에 참고하면 좋을 것 같아요.
> 
- 새로 배울 것이 너무 많으면 배우느라 구현할 시간이 부족해진다. 테크 스택을 너무 많이 쌓지 않기.
- 버전을 고를 때는 각 라이브러리가 서로 잘 통합되어야 하고 공식 문서와 커뮤니티의 지원이 충분히 있어야 함을 고려하기.
- 회의할 때 얘기한 것들은 모두가 공유하고 있다. 그러니 커뮤니케이션을 쉽게 하기 위해 그 내용을 충분히 반영하기.
- 프로그램이 복잡하기 때문에 단순한 모듈로 나누면 다루기 쉬울 것이다. 그리고 일을 나누기에도 좋을 것이다. 그러니 High cohesion — Low coupling을 가지도록 프로그램을 나누기

# 폴더 구조

> Notion에서 보면 아마 더 보기 편할 겁니다!

- client
    - src
        - components
            - Game ← Phaser가 들어가는 폴더
                - entity
                    - `Phaser entities (js files)`
                        
                        ```jsx
                        export default class Firefly extends Phaser.Physics.Arcade.Sprite { ... }
                        ```
                        
                - scenes
                    - `Phaser scenes (js files)`
                        
                        ```jsx
                        export default class MainScene extends Phaser.Scene { ... }	
                        ```
                        
                - `index.js` ← Phaser base, as a React component
                    
                    ```jsx
                    export default class Game extends React.Component { ... }
                    ```
                    
            - `React components (js files)`
                
                ```jsx
                class ClientComponent extends Component { ... }
                ```
                
        - `index.js` ← 처음에 실행되는 스크립트
        - `App.css` ← App.js를 위한 스타일 시트
        - `App.js` ← 모든 컴포넌트를 감싸고 있는 리액트 컴포넌트
            
            ```jsx
            class App extends Component { ... }
            ```
            
    - public ← static files
        - assets ← Phaser assets
            - audio
                - `Sound files (e.g. *.mp3)`
            - backgrounds
                - `Image files which will not move`                    
            - sprites
                - `Image files which will move`
            - spriteSheets
                - `Image files for animation`
        - `index.html`  ← 처음에 보여지는 HTML 파일
- server
    - routes
        - `scripts for each route (js files)` ← `express` 로 들어온 HTTP 요청이 `index.js` 에 있는 라우팅 규칙에 따라 이곳에 있는 스크립트들로 전달된다.
    - `index.js` ← 서버 스크립트. 지금은 모든 socketIO 요청과 응답을 여기서 처리하고 있음.