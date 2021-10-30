import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

function InvitationView() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    socket.connect();
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

export default InvitationView;