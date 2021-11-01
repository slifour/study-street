import React, { useEffect, useState } from "react";

import './App.css';
import ClientComponent from "./components/ClientComponent";
import MenuBar from "./components/ui/MenuBar";
import Game from "./components/Game";
import InvitationView from "./components/User/InvitationView";
import GroupView from "./components/User/GroupView";
import UserInfo from "./components/User/UserInfo";
import Login from "./components/User/LogIn";

function App() {
  
  const [loadClient, setLoadClient] = useState(true);
  const [userID, setUserID] = useState(false);

  const onLogin = userID => {
    setUserID(userID);
  };

  return (
  <>
    <div className="content">
      <button onClick={ () => setLoadClient(prevState => !prevState)}>
        {loadClient ? "STOP CLIENT" : "START CLIENT"}
      </button>
      {loadClient ? <ClientComponent></ClientComponent> : null}
      <MenuBar/>
    </div>
    <div className="game-container">
      <Game />
    </div>
    <div>
      {userID ? <div> Login: {userID} </div> : <Login onLogin={onLogin}></Login> }
      <UserInfo userID={userID}></UserInfo>
      {/* <InvitationView></InvitationView> */}
      {/* <GroupView></GroupView>     */}
    </div>
  </>
  );
}

export default App;
