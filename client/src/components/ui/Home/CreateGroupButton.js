import React from "react";
import styles from "./home.module.scss";
import styled from "styled-components";

const StyledAvatar = styled.div`
    box-shadow: 0px 4px 4px rgba(88, 88, 88, 0.25);
    border-radius: 20%;
    color: #747474;
    width: 45px;
    height: 45px;
    font-size: 36px;
    line-height: 45px; 
    text-align: center;
    font-weight: 600;
    cursor: pointer;
    background: #414141;
`;

export default function CreateGroupButton() {
  return (
    <div className={styles.sidebarItem}>
      <StyledAvatar>+</StyledAvatar>
    </div>
  );
}