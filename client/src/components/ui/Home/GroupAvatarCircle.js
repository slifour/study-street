import React from 'react';
import styled from 'styled-components';
import styles from "./home.module.scss";

const StyledAvatar = styled.div`
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 20%;
    color: ${props => props.color};
    text-align: center;
    font-weight: 600;
    cursor: pointer;
    background: ${props => props.background};
`;

export default function GroupAvatarCircle({group, size}) {
    
    size = size || 60; // default size in px
    const fontSize = size / 2.5;
    const lineHeight = size;
    const shortID = group.groupID.substr(0, 2).toUpperCase();
    const defaultColor = "#ffffff";
    const defaultBackground = "#00bc36"

    return (
        <div>
            { 
                <StyledAvatar 
                    color = {group.colors ? group.colors[0] : defaultColor} 
                    background = {group.colors ? group.colors[1] : defaultBackground} 
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        lineHeight: `${lineHeight}px`,
                        fontSize: `${fontSize}px`
                    }
                }>
                    {shortID}
                </StyledAvatar>
            }
        </div>
    )
}