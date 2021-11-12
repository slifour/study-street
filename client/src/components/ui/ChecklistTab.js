import React from 'react';
import styles from './checklist.module.css';
import styled from 'styled-components';

const StyledTab = styled.div`
    width : 50%;
    height : 80px;
    display : flex;
    justify-content : center;
    align-items : center;
    gap : 15px;
    background : ${props => props.colored};
    border-top-left-radius : ${props => props.left};
    border-top-right-radius : ${props => props.right};
    cursor: pointer;
`

const StyledTabText = styled.div`
    font-family: 'Lato', sans-serif;
    font-weight: 600;
    font-size: 21px;
    color: ${props => props.colored};
`

export default function ChecklistTab(props) {
    const getPersonalColor = () => {
        if (!props.state){
            return '#EDEDED';
        } else {
            return '#FBFBFB';
        }
    }

    const getGroupColor = () => {
        if (props.state){
            return '#EDEDED';
        } else {
            return '#FBFBFB';
        }
    }

    const getPersonalText = () => {
        if (!props.state){
            return '#C9C9C9';
        } else {
            return '#0C0C0C';
        }
    }

    const getGroupText = () => {
        if (props.state){
            return '#C9C9C9';
        } else {
            return '#0C0C0C';
        }
    }

    return(
        <div>
            <div className={styles.tabBox}>
                <StyledTab
                    colored = {getPersonalColor()}
                    left = {'11px'}
                    right = {'0px'}
                    onClick = { () => props.setPersonal(true) }>
                        {/* <div className={styles.icons}>account_circle</div> */}
                        <StyledTabText colored ={getPersonalText}>My Checklist</StyledTabText>
                    </StyledTab>
                <StyledTab
                    colored ={getGroupColor()}
                    left = {'0px'}
                    right = {'11px'}
                    onClick={ () => props.setPersonal(false) }>
                        <StyledTabText colored ={getGroupText}>Group Quests</StyledTabText>
                    </StyledTab>
            </div>
        </div>
    )
}