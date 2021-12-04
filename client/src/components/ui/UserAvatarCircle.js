import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import styles from './ui.module.css'

const StyledAvatar = styled.img`
    filter: drop-shadow(0px 4px 4px rgba(88, 88, 88, 0.25));
    border-radius: 50%;
    cursor: pointer;
`;

export default function UserAvatarCircle(props) {
    // props: user, size, onHover, onClick
    const size = props.size || 60; // default size in px
    // const fontSize = size / 2.5;
    // const lineHeight = size;
    // const shortID = user.userID.substr(0, 2).toUpperCase();
  
    // const {loginUser} = useContext(LoginUserContext);
    //status is expressed by 'studying', 'online', 'offline'
    const [status, setStatus] = useState('online');

    const onMouseEnterItem = props.onMouseEnterItem;

    const [showItem, setShowItem] = useState(false);

    const onMouseEnter = () => {
        setShowItem(true)
    }
    
    const onMouseLeave = () => {
        setShowItem(false)
    }

    const findImageSrc = user => (user.avatarSprite ? `/assets/images/${user.avatarSprite}_preview.gif` : null);

    return (
        <>
            { props.user ? 
                <div onClick={props.onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style = {{position : `relative`}}>
                    <StyledAvatar style={{
                        width: `${size}px`,
                        // height: `${size}px`,            
                    }} src={findImageSrc(props.user)} />
                    {
                        showItem?
                        <div className = {styles.userAvatarItem} style = {{top : `-14px`}}>
                            {onMouseEnterItem}
                        </div> :
                        null
                    }    
                </div>    
                : <div>
                  <StyledAvatar style={{
                        width: `${size}px`,
                        height: `${size}px`,            
                    }} src={null} /> 
                </div>
            }
        </>
        
    )
}