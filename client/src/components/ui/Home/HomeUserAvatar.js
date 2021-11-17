import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import { LoginUserContext } from '../../../App';
import UserAvatarCircle from './UserAvatarCircle';
import styles from "./home.module.css";

export default function HomeUserAvatar(props) {
    
    const {loginUser} = useContext(LoginUserContext);

    return (
        <div className={styles.sidebarItem}>
            { 
              loginUser ? 
              <UserAvatarCircle user={loginUser} size={60}/>
              : <div> not logged in. </div>
            }
        </div>
    )
}