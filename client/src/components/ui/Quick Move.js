import React, { useState, useEffect } from "react";
import socket from "../../socket";

function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.connect();
    socket.on("FromAPI", data => {
      setResponse(data);
    })
    return () => {};
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default ClientComponent;

/**
 * One socket connection per one client
 * one socket should be shared by phaser scenes
 * Some components should share  
 */