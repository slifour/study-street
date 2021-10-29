import React, { useEffect, useState } from "react";

import './App.css';
import ClientComponent from "./components/ClientComponent";
// import Leaderboard from "./components/Leaderboard";
import Game from "./components/Game";

function App() {
  const [loadClient, setLoadClient] = useState(true);

  return (
  <>
    <div className="content">
      <button onClick={ () => setLoadClient(prevState => !prevState)}>
        {loadClient ? "STOP CLIENT" : "START CLIENT"}
      </button>
      {loadClient ? <ClientComponent></ClientComponent> : null}
      {/* <Leaderboard /> */}
    </div>
    <div className="game-container">
      <Game />
    </div>
  </>
  );
}

export default App;
