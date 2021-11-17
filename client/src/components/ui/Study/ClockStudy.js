import React, { useCallback, useEffect, useState } from "react";
import useRequest from "../../request/useRequest";
import styles from "../ui.module.css";
import studyStyles from "./study.module.css";

const CLOCK_REPEAT_INTERVAL = 1000; // unit: ms
const UPDATE_STUDY_TIME_INTERVAL = 3 * 1000 // unit: ms

export default function ClockStudy() {
  const [displayNowTime, setDisplayNowTime] = useState(new Date());
  const [studyTimeBeforeCurrent, setStudyTimeBeforeCurrent] = useState(0);
  const [studyStartTime, setStudyStartTime] = useState(new Date());
  
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [willUpdateStudyTime, setWillUpdateStudyTime] = useState(false);

  const onGetResponseOK = useCallback(({payload}) => {
    setStudyTimeBeforeCurrent(payload);
  }, []);

  const onGetResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to load today's study time (client msg)");
  }, []);

  const [requestGet, innerReloadTimeRefGet] = useRequest({
    requestType: "REQUEST_TODAY_STUDY_TIME", 
    responseType: "RESPONSE_TODAY_STUDY_TIME", 
    // makePayload: () => ({}), 
    onResponseOK: onGetResponseOK, 
    onResponseFail: onGetResponseFail
  });

  
  const onUpdateResponseFail = useCallback(payload => {
    console.warn(payload.msg || "Failed to update today's study time (client msg)");
  }, []);

  const makePayloadUpdate = useCallback(() => {
    return todayStudyTime; 
  }, [todayStudyTime]);

  const [requestUpdate, innerReloadTimeRefUpdate] = useRequest({
    requestType: "REQUEST_UPDATE_TODAY_STUDY_TIME", 
    responseType: "RESPONSE_UPDATE_TODAY_STUDY_TIME", 
    makePayload: makePayloadUpdate, 
    onResponseFail: onUpdateResponseFail
  });

  useEffect(() => {
    requestGet();
  }, [requestGet]);

  useEffect(() => {
    setTodayStudyTime(displayNowTime - studyStartTime + studyTimeBeforeCurrent);
  }, [displayNowTime, studyStartTime, studyTimeBeforeCurrent]);

  useEffect(() => {
    const repeatClock = () => { setDisplayNowTime(new Date()) };
    const clockTimerId = setInterval(repeatClock, CLOCK_REPEAT_INTERVAL); 
    return () => {clearInterval(clockTimerId);};
  }, []);

  useEffect(() => {
    console.log("check whether we will update user study time");
    if (willUpdateStudyTime) {
      requestUpdate();
      setWillUpdateStudyTime(false);
    }
  }, [willUpdateStudyTime, requestUpdate]);

  useEffect(() => {
    const updateTimerId = setInterval(() => { setWillUpdateStudyTime(true); }, UPDATE_STUDY_TIME_INTERVAL);
    return () => {clearInterval(updateTimerId);};
  }, []);

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
  };

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
        { getParsedDuration(todayStudyTime) }
      </div>
    </div>
  )
}