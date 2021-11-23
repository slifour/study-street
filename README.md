# study-street

## Getting started to develop
### Dependencies
- Node v14
- Browser: Chrome
### Install
- Server
    - At the root directory
    - `cd server`
    - `npm install`
- Client
    - At the root directory
    - `cd client`
    - `npm install`
### Run

In development environment, study-street uses `concurrently` to run two servers simultaneously.  
- At the project root directory, do
- `cd server`
- `npm run dev`
### Used libraries

There are three main libaries.
- React: React is used for ui components and managing data
- Phaser: Phaser is a javascript-based 2d game library. It is used for our virtual space shared by multiple users.
- socket.io: socket.io is a library that supports a continuous and low-latency connection with clients and the server. It is used for all client-server communication, as well as for sharing states of virtual space.

### Files and folder structure
#### Criteria for choosing

- Too many new technologies will make development hard. Do not be too much. 
- Choose a version with which each library can be integrated easily and enough supports from documents and commmunity exist.  
- Modularize program so that each module is simple enough. It will make cowork easier. Let modules have high cohesion and low coupling.
#### Structure

- client
    - src
        - components
            - Game ← A folder for Phaser scripts
                - entity
                    - Phaser entities (js files)  
                - scenes
                    - Phaser scenes (js files)    
                - `index.js` ← Phaser base, as a React component                    
            - request
                - React helper functions for server request. For more info, refer [client/src/components/request/README.md]
            - ui
                - React components. To explorer these components, start from [client/src/App.js].                
        - `index.js` ← The initially executed script.
        - `App.css` ← A stylesheet for App.js.
        - `App.js` ← The base react component which is a parent for all other components.
        - `socket.js` ← Singleton socket.io client instance.
            
    - public ← static files
        - assets ← Phaser assets                
            - images
                - `Image files`
            - spriteSheets
                - `Image files for animation`
        - `*-icon-*.png` ← Site icons
        - `index.html` ← Base HTML file
- server
    - `app.js` ← The initially executed script script of server. It initialize a new SocketIOServer instance.
    - `socketIOServer.js` ← The base script for all socket io communication. It directly handles requests for virtual space and chat. 
    - `requestHandle.js` ← This script handles most requests that do not require strict real time communication. Requests handled by this script is defined in [requestType.js]. For more information, refer [client/src/components/request/README.md].
    - `requestType.js` ← Most constants for request and response are defined here.
    - `room.js` ← A class for users and their positions in each scene.
    - `database.js` ← A database. Currently, we do not use a persistent database. The database is stored in RAM through this file.