import React, {useContext, useEffect, useState, useCallback} from 'react';
import { LoginUserContext } from '../../App';
import SingleAvatar from './SingleAvatar';
import styles from './ui.module.css';
import useRequest from '../request/useRequest';
import GroupAvatarCircle from './GroupAvatarCircle';

export default function Avatars() {
    const {loginUser} = useContext(LoginUserContext);
    const [group, setGroup] = useState(null);

    const onResponseOK = useCallback(({payload}) => {
        console.log("Sidebar chat avatars: group List (client) got: ", payload);
        const [curGroupInfo, curGroupMemberInfo] = payload;
        setGroup(curGroupInfo);
    }, [loginUser]);

    const onResponseFail = useCallback(({payload}) => {
        console.warn(payload.msg || "Failed to obtain current group (client msg)");
    }, []);

    const makePayload = useCallback(() => ({
        userID: loginUser.userID
    }), [loginUser]);

    const [request, innerReloadTimeRef] = useRequest({
        requestType: "REQUEST_CURRENT_GROUP",
        responseType: "RESPONSE_CURRENT_GROUP",
        makePayload,
        onResponseOK,
        onResponseFail
    });

    useEffect(() => {
        request();
    }, [loginUser, request]);

    return(
        <div className={styles.avatarContainer}>
            { group ?
                <>
                <GroupAvatarCircle group={group} onMouseEnterItem={group.groupName} />
                { group.member.map(userID => (
                    <SingleAvatar userID={userID} key={userID}/>
                )) }
                </>
                : null
            }
        </div>
    )
}