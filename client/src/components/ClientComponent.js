import React, { useState, useEffect } from "react";
import { socket } from "../socket";

const ENDPOINT = "http://localhost:4001";

function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.on("FromAPI", data => {
      setResponse(data);
    })
    return () => socket.disconnect();
  }, []);

  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  );
}

export default ClientComponent;