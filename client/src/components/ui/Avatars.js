import React, {useEffect} from 'react';
import SingleAvatar from './SingleAvatar';
import styles from './ui.module.css';

export default function Avatars() {
    // const [avatarList, setAvatarList] = useState([]);

    useEffect(() => {
        //request all users in group
    }, [])

    return(
        <div className={styles.avatarContainer}>
            {/* Print avatars           
            {avatarList.map((avatar) => (
                <SingleAvatar userId={avatar.userId}></SingleAvatar>
            ))} */}

            {/* dummy avatars */}
            <SingleAvatar userId={"eunki"}></SingleAvatar>
            <SingleAvatar userId={"haeseul"}></SingleAvatar>
            <SingleAvatar userId={"hyeon"}></SingleAvatar>
        </div>
    )
}