import React, { useState, useEffect } from "react";
import socket from './socketConfig';

function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socketConnected = socket
    socketConnected.on("FromAPI", data => {
      setResponse(data);
    })
    return () => socketConnected.disconnect();
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