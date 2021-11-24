import React from "react";
import styles from "./home.module.css";
import styled from "styled-components";

export default function UserAvatarSpritePreview({user}) {

  const StyledImg = styled.img``;

  const findImageSrc = user => (user.avatarSprite ? `/assets/images/${user.avatarSprite}_preview.gif` : null);

  return (
    <StyledImg src={findImageSrc(user)} width={100} />
  );
}