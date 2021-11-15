import React, { useState } from "react";
import styles from "../ui.module.css";
import studyStyles from "./study.module.scss";
import IconButton from "../IconButton";
import ChecklistContainer from "../ChecklistContainer";

export default function MenuBarStudy() {

  const [showChecklist, setShowChecklist] = useState(true);

  const onChecklistClick = () => {
    setShowChecklist(!showChecklist);
  };

  return (
    <>
    <div>
      { showChecklist ? 
        <div className={studyStyles.checklist}> {/* TODO: Write .checklist stylesheet */}
          <ChecklistContainer/>
        </div>
        : null
      }
    </div>
    <div className={styles.menuBar}>
      <IconButton iconName={"today"}/>
      {/* iconName = list_alt이면 다른 이벤트 핸들러가 호출되기 때문에 임시로 아이콘을 바꿨어요!
        * IconButton보다 menubar에서 클릭 이벤트를 처리하는 게 더 깔끔할 것 같아 이렇게 해볼게요. */}
      <div onClick={onChecklistClick}><IconButton iconName={"list"}/></div>
      <IconButton iconName={"logout"}/>
      <IconButton iconName={"settings"}/>
    </div>
    </>
  );
}