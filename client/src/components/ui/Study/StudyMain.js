import React from "react";
import styles from "../ui.module.css";
import ClockStudy from "./ClockStudy";
import studyStyles from "./study.module.scss";

export default function StudyMain() {
  return (
    <div className={studyStyles.studyMain}>
      <ClockStudy/>
    </div>
  )
}