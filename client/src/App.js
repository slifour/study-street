import React, { useRef, useEffect, useState } from "react";
import './App.css';
import MenuBar from "./components/ui/MenuBar";
import Game from "./components/Game";
import InvitationView from "./components/User/InvitationView";
import GroupView from "./components/User/GroupView";
import UserInfo from "./components/User/UserInfo";
import Login from "./components/User/LogIn";
import Tooltip from "./components/Game/entity/Tooltip";
import Avatars from "./components/ui/Avatars";


/* Example of LoginUserContext value
  {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
  }
  */
export const LoginUserContext = React.createContext(null);

function App() {

  const eventEmitter = require('events');
  window.ee = new eventEmitter();
  
  const [loginUser, setLoginUser] = useState(null);
  const game = useRef(null);

  useEffect(() => {
    if (game.current !== null && game.current.game) {
      game.current.game.registry.set("loginUser", loginUser);
    }
  }, [loginUser])

  return (
    <LoginUserContext.Provider value={ {loginUser, setLoginUser} }>
      <div className="content">
        <MenuBar/>
        <Avatars/>
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
    </LoginUserContext.Provider>
  );
}

export default App;
