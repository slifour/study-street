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

- Server
    - At the root directory
    - `cd server`
    - `node app.js`
- Client
    - At the root directory
    - `cd client`
    - `npm start`

## What the program do

- React ↔ Phaser
    - Phaser 컨테이너가 `<Game />` 컴포넌트로 `App.js` 에 들어가 있다.
- React ↔ Socket io
    - Socket io를 이용해 서버 시간을 받아와 보여주는 컴포넌트가 `<ClientComponent />` 컴포넌트로 `App.js` 에 들어가 있다.
- Socket io ↔ Phaser
    - 