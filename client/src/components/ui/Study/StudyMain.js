import React, { useContext, useEffect } from "react";
import { LoginUserContext } from "../../../App";
import ChecklistContainer from "../ChecklistContainer";
import ClockStudy from "./ClockStudy";
import studyStyles from "./study.module.css";
import PostButton from "./PostButton";
import checklistStyles from "../checklist.module.css";
import styled from "styled-components";
import useWindowDimensions from "./UseWindowDimension";

const StyledChecklistWrapper = styled.div`
  height: ${props => props.height}px;

  /*
  .${checklistStyles.personalContainer} {
    height: ${props => props.personalContainerHeight}px;
  }
  .${checklistStyles.groupGoalsContainer} {
    height: ${props => props.groupGoalsContainerHeight}px;
  }
  */
`

export default function StudyMain() {
  const {loginUser} = useContext(LoginUserContext);
  const {width, height} = useWindowDimensions();

  useEffect(() => {
    if (!loginUser) {
      alert("Login is required");
    }
  }, [])

  return (
    <div className={studyStyles.studyMain}>
      <ClockStudy/>
      <PostButton/>
      <StyledChecklistWrapper 
          className={`${studyStyles.checklist} ${checklistStyles.dark}`}
          height={Math.min(700, height - 200)}>
        <ChecklistContainer/>
      </StyledChecklistWrapper>
    </div>
  )
}