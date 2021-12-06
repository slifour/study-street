import React, {useEffect, useState, useCallback} from 'react';
import styled from 'styled-components';
import Modal from 'react-overlays/Modal';
import ChatOverlay from './ChatOverlay';
import UserAvatarCircle from './UserAvatarCircle';
import useRequest from '../request/useRequest';

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

export default function SingleAvatar({userID}) {    

    const [user, setUser] = useState(null);

    const onResponseOK = useCallback(({payload}) => {
        setUser(payload);
    }, []);
    
    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to load a user profile for chat (client msg)");
    }, []);
    
    const makePayload = useCallback(() => ({ userID }), [userID]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_MY_PROFILE",
        responseType: "RESPONSE_MY_PROFILE",
        makePayload,
        onResponseOK,
        onResponseFail
    });

    useEffect(() => {
        request();
    }, [request]); // It is guaranteed that there is a login user in library scene

    //this will be moved to hover-drop menu soon
    const [open, setOpen] = useState(false);

    //status can be expressed by 'studying', 'online', 'offline'
    // const [status, setStatus] = useState('online');

    const renderBackdrop = (props) => <Backdrop {...props} />;

    if (!user) {
        return (<div></div>);
    }

    return (
        <div>
            <UserAvatarCircle user={user} size={60} onClick={() => setOpen(true)} onMouseEnterItem={user.userName} />
            <StyledModal
                show = {open}
                onHide = {() => setOpen(false)}
                renderBackdrop = {renderBackdrop}
            ><ChatOverlay
                userId = {userID}
                color = {"#79ACBC"} 
            ></ChatOverlay>
            </StyledModal>
        </div>
    )
}