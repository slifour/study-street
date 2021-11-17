import React, {useState} from 'react';
import styled from 'styled-components';
import styles from "./home.module.css";

const StyledAvatar = styled.div`
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 50%;
    color: #FDFDFD;
    text-align: center;
    font-weight: 600;
    cursor: pointer;
    background: ${props => props.color};
`;

export default function UserAvatarCircle({user, size}) {
    
    size = size || 70; // default size in px
    const fontSize = size / 2.5;
    const lineHeight = size;
    const shortID = user.userID.substr(0, 2).toUpperCase();
  
    // const {loginUser} = useContext(LoginUserContext);
    //status is expressed by 'studying', 'online', 'offline'
    const [status, setStatus] = useState('online');

    return (
        <div>
            { 
                <StyledAvatar color = {user.color || "#555555"} style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    lineHeight: `${lineHeight}px`,
                    fontSize: `${fontSize}px`
                }}>
                    {shortID}
                </StyledAvatar>
            }
        </div>
    )
}