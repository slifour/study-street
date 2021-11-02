import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import socket from '../../socket';
import Modal from 'react-overlays/Modal';
import ChatOverlay from './ChatOverlay';

const StyledAvatar = styled.div`
    width: 70px;
    height: 70px;
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 50%;

    color: #FDFDFD;
    line-height: 70px;
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    cursor: pointer;

    background: ${props => props.color};
`;

const StyledModal = styled(Modal)`
    position: fixed;
    width: 400px;
    height: 550px;
    z-index: 1040;
    bottom: 10%;
    left: 8%;
    border-radius: 8px;
    outline: none;
    background-color: white;
    box-shadow: 0px 4px 10px rgba(71, 71, 71, 0.25);
`;

const Backdrop = styled("div")`
    position: fixed;
    z-index: 1040;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    opacity: 0.2;
`;

export default function SingleAvatar(props) {
    
    const shortenName = props.userId.substr(0, 2).toUpperCase();
    const [profile, setProfile] = useState({});

    //this will be moved to hover-drop menu soon
    const [open, setOpen] = useState(false);

    //status is expressed by 'studying', 'online', 'offline'
    const [status, setStatus] = useState('online');

    const renderBackdrop = (props) => <Backdrop {...props} />;

    useEffect(() => {
        socket.emit("userProfileRequest", props.userId);
    }, [])

    socket.on("userProfile", (userInfo) => {
        // setStatus(userInfo.status);
        // setProfile(userInfo.profile);
        
        // dummy informations
        setStatus('studying');
        setProfile({
            color : '#79ACBC',
            image : false
        });
    })

    return (
        <div>
            <StyledAvatar
                color = {profile.color}
                onClick = {() => setOpen(true)}
            >{shortenName}</StyledAvatar>
            <StyledModal
                show = {open}
                onHide = {() => setOpen(false)}
                renderBackdrop = {renderBackdrop}
            ><ChatOverlay
                userId = {props.userId}
                color = {profile.color}
            ></ChatOverlay>
            </StyledModal>
        </div>
    )
}