import React, { useRef, useEffect, useState } from "react";
import './App.css';
import MenuBar from "./components/ui/MenuBar";
import Game from "./components/Game";
import Login from "./components/User/LogIn";
import Avatars from "./components/ui/Avatars";
import {GroupListButton} from "./components/ui/GroupList";
import {ConfirmAlert, QuickMoveButton} from "./components/ui/QuickMove";
import HomeMain from "./components/ui/Home/HomeMain";


/* Example of LoginUserContext value
  {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
  }
  */
export const LoginUserContext = React.createContext(null);
export const GameContext = React.createContext(null);

function App() {
  
  const [loginUser, setLoginUser] = useState(null);
  const [scene, setScene] = useState("Library");  
  const [showConfirmAlert, setshowConfirmAlert] = useState(false);  
  const game = useRef(null);
  const [fadeProp, setFadeProp] = useState({
    fade: 'fade-in'
  });

  useEffect(() => {
    if (game.current !== null && game.current.game) {
      game.current.game.registry.set("loginUser", loginUser);
    }
  }, [loginUser])

  useEffect(() => {
    let timeout = null;
    if (game.current !== null && game.current.game){
      game.current.game.events.on("changeScene", newScene => {
        setFadeProp({fade: 'fade-out'});
        // timeout = setTimeout(() => setFadeProp({fade: 'fade-in'}), 1000);
        timeout = setTimeout(() => setFadeProp({fade: 'open-in'}), 1000);
        setScene(newScene);
      })
    }
    return () => {
      clearInterval(timeout);
    }      
  }, [])

  const emitToGame = (data => {
    if (game.current !== null && game.current.game) {
      game.current.emit(data)
    }
    console.log('emitToGame', data)
  }) 

  return (
    <LoginUserContext.Provider value={ {loginUser, setLoginUser} }>
      <GameContext.Provider value={ {scene, emitToGame} }>
      <div className={fadeProp}>
      <div className="content">
        <HomeMain></HomeMain>
        <MenuBar/>
        {/* <Avatars/> */}
        <QuickMoveButton emitToGame = {emitToGame}></QuickMoveButton>
        <ConfirmAlert show = {showConfirmAlert} setShow = {setshowConfirmAlert}></ConfirmAlert>
      </div>
      <div className="game-container">
        <Game ref={game}/>
      </div>
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
