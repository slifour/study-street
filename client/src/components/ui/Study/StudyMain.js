import React, { useContext, useEffect } from "react";
import { LoginUserContext } from "../../../App";
import styles from "../ui.module.css";
import ClockStudy from "./ClockStudy";
import studyStyles from "./study.module.scss";
import PostButton from "../PostButton";

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
    </div>
  )
}