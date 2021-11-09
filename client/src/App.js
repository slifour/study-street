import React, { useRef, useEffect, useState } from "react";
import './App.css';
import MenuBar from "./components/ui/MenuBar";
import Game from "./components/Game";
import Login from "./components/User/LogIn";
import Tooltip from "./components/Game/entity/Tooltip";
import Avatars from "./components/ui/Avatars";
import {GroupListButton} from "./components/ui/GroupList";
import {QuickMoveButton} from "./components/ui/QuickMove";


/* Example of LoginUserContext value
  {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
  }
  */
export const LoginUserContext = React.createContext(null);
export const GameContext = React.createContext(null);

const box_active = {
  width: "300px",
  height: "200px",
  border: "1px solid black",
  position: "relative",
  background: "grey",
  opacity: "1",
  transition: "opacity 500ms",
};

function App() {
  
  const [loginUser, setLoginUser] = useState(null);
  const game = useRef(null);

  useEffect(() => {
    if (game.current !== null && game.current.game) {
      game.current.game.registry.set("loginUser", loginUser);
    }
  }, [loginUser])


  // const [currentScene, setCurrentScene] = useState("")

  // setCurrentScene(game.current.game.registry.get("currentScene"))

  const emitToGame = (data => {
    if (game.current !== null && game.current.game) {
      game.current.emit(data)
    }
  }) 

  return (
    <LoginUserContext.Provider value={ {loginUser, setLoginUser} }>
      <GameContext.Provider value={{game}}>
      <div className="content">
        <MenuBar/>
        <Avatars/>
        <GroupListButton></GroupListButton>
        <QuickMoveButton emitToGame = {emitToGame}></QuickMoveButton>
      </div>
      <div className="game-container">
        <Game ref={game}/>
      </div>
      <div>
        <Login></Login>
        {/* <UserInfo></UserInfo> */}
        {/* <InvitationView></InvitationView> */}
        {/* <GroupView></GroupView>     */}
      </div>
      </GameContext.Provider>
    </LoginUserContext.Provider>
  );
}

export default App;
