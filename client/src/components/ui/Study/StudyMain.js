import React, { useContext, useEffect } from "react";
import { LoginUserContext } from "../../../App";
import ChecklistContainer from "../ChecklistContainer";
import styles from "../ui.module.css";
import ClockStudy from "./ClockStudy";
import studyStyles from "./study.module.css";
import PostButton from "./PostButton";
import checklistStyles from "../checklist.module.css";

export default function StudyMain() {
  const {loginUser} = useContext(LoginUserContext);
  useEffect(() => {
    if (!loginUser) {
      alert("Login is required");
    }
  }, [])

  return (
    <div className={studyStyles.studyMain}>
      <ClockStudy/>
      <PostButton/>
      <div className={`${studyStyles.checklist} ${checklistStyles.dark}`}>
        <ChecklistContainer/>
      </div>
    </div>
  )
}