import React, { useEffect, useState } from "react";
import styles from "../ui.module.css";
import studyStyles from "./study.module.scss";

export default function ClockStudy() {
  const REPEAT_DURATION = 1000; // unit: ms

  const [displayNowTime, setDisplayNowTime] = useState(new Date());
  const [studyStartTime, setStudyStartTime] = useState(new Date());
  const [studyTime, setStudyTime] = useState(0);

  const getParsedDuration = ms => {
    // Refer https://stackoverflow.com/questions/29816872/how-can-i-convert-milliseconds-to-hhmmss-format-using-javascript
    // 1- Convert to seconds:
    let seconds = parseInt(ms / 1000);
    // 2- Extract hours:
    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  const repeat = () => {
    const now = new Date();
    setDisplayNowTime(now);
    setStudyTime(now - studyStartTime);
  };

  useEffect(() => {
    const timerId = setInterval(repeat, REPEAT_DURATION);
    return () => { clearInterval(timerId); };
  })

  return (
    <div className={studyStyles.clock}> 
      <div className={studyStyles.clockDate}>
        {displayNowTime.toLocaleString("en", {
          dateStyle: "full",
          timeStyle: "short"
        })}
      </div>
      <div className={studyStyles.clockStudyTime}>
        <span className={`${studyStyles.clockIcon}`}>timer</span> 
        { getParsedDuration(studyTime) }
      </div>
    </div>
  )
}