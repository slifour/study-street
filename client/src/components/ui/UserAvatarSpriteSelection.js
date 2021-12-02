import React, {useState} from "react";
import styles from "./ui.module.css";
import styled from "styled-components";

export default function UserAvatarSpriteSelection({avatarSprite, width, onClick, selected}) {

  const StyledImg = styled.img``;
  const StyledImgOpacity = styled.img`
  opacity : 0.5;`;
  // const {scale, setScale} = useState(1);/

  const findImageSrc = avatarSprite => (avatarSprite ? `/assets/images/${avatarSprite}_preview.gif` : null);

  const [onHover, setOnHover] = useState(false);
  // const [selected, setSelected] = useState(selectedDefault? selectedDefault : false);
  console.log("selected?", selected)


  return (
    selected ?     
    <div
      className={styles.iconButtonContainer}
      > 
      <StyledImg src={findImageSrc(avatarSprite)} width={width*1.2}/>
    </div> :
    <div
      className={styles.iconButtonContainer}
      className={styles.hvrGrow}
      onMouseEnter={selected? null : ()=>setOnHover(true)}
      onMouseLeave={selected? null : ()=>setOnHover(false)}
      onClick={onClick}
      > 
      <StyledImgOpacity src={findImageSrc(avatarSprite)} width={width}/>
    </div>
  );
}