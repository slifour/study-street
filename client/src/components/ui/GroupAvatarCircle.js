import React from 'react';
import styled from 'styled-components';

const StyledHoverLabelWrapper = styled.div`
    .hoverLabel { 
        position: absolute;
        font-weight: 800;
        opacity: 0;
        top: ${props => -(props.size || 60)}px;
    }
    &:hover .hoverLabel {
        opacity: 1;
    }
`;

const StyledAvatar = styled.div`
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 20%;
    color: ${props => props.color};
    text-align: center;
    font-weight: 600;
    cursor: ${props => props.onClick ? "pointer" : "default"};
    background: ${props => props.background};
`;

export default function GroupAvatarCircle({group, size, onMouseEnterItem, onClick}) {
    
    size = size || 60; // default size in px
    const fontSize = size / 2.5;
    const lineHeight = size;
    const displayName = group.groupName.substr(0, 2).toUpperCase();
    const defaultColor = "#ffffff";
    const defaultBackground = "#00bc36"

    return (
        <div>
            <StyledHoverLabelWrapper
                style={{
                    width: `${size}px`
                }}>
                <p className="hoverLabel">{onMouseEnterItem}</p>
                <StyledAvatar 
                    onClick={onClick}
                    color = {group.colors ? group.colors[0] : defaultColor} 
                    background = {group.colors ? group.colors[1] : defaultBackground} 
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        lineHeight: `${lineHeight}px`,
                        fontSize: `${fontSize}px`
                    }
                }>
                    {displayName}
                </StyledAvatar>
            </StyledHoverLabelWrapper>
        </div>
    )
}