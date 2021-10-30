import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

function GroupView({userID}) {
  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    socket.on("userParticipatedGroup", groupList => {
      setGroupList(groupList);
    })
    return () => {};
  }, []);

  const onClick = () => {
    socket.emit("userParticipatedGroupRequest", userID);
  }

  return (
    <div>
    <p>가입한 그룹</p> <button onClick={onClick}> 보기 </button>
    {
      groupList.length > 0 ?
      groupList.map(group => {
        return (
          <div>
            <p>{group.groupName}</p>
            <div>
              <p> 멤버 </p>
              {group.member.map(userID => {
                return (<p> - {userID} </p>);
              })}
            </div>
          </div>)
        ;
      })
      : null
    }
    </div>
  );
}

export default GroupView;