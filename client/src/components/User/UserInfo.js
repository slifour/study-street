import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

function UserInfo({userID}) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    console.log("user info use effect");
    socket.on("userProfile", profile => {
      setProfile(profile);
    })
    socket.emit("userProfileRequest", userID);
    return () => {};
  }, [userID]);

  return (
    <div>
      {profile ? 
      <> <b>{profile.userName}</b>님 화이팅~ </>
      : null}
    </div>
  );
}

export default UserInfo;