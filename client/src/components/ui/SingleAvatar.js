import React, {useEffect} from 'react';
import socket from '../../../socket';

export default function SingleAvatar(props) {
    
    useEffect(() => {
        socket.emit("userProfileRequest", props.userId);
    }, [])

    socket.on("userProfile", (userInfo) => {
        console.log(userInfo)
    })
    
    return (
        <div>
            
        </div>
    )
}