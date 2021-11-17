import React, {useState} from 'react';
import styled from 'styled-components';

const StyledAvatar = styled.img`
    filter: drop-shadow(0px 4px 4px rgba(88, 88, 88, 0.25));
    border-radius: 50%;
    cursor: pointer;
`;

export default function UserAvatarCircle(props) {
    // props: user, size, onClick
    const size = props.size || 70; // default size in px
    // const fontSize = size / 2.5;
    // const lineHeight = size;
    // const shortID = user.userID.substr(0, 2).toUpperCase();
  
    // const {loginUser} = useContext(LoginUserContext);
    //status is expressed by 'studying', 'online', 'offline'
    const [status, setStatus] = useState('online');

    return (
        <div onClick={props.onClick}>
            { 
                <StyledAvatar style={{
                    width: `${size}px`,
                    height: `${size}px`
                }} src={props.user.profileImage} />
            }
        </div>
    )
}