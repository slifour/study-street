import React, { useContext } from "react";
import { GameContext } from "../../App";
import MenuBarDefault from "./MenuBarDefault";
import MenuBarStudy from "./Study/MenuBarStudy";

export default function MenuBar() {
  const { scene } = useContext(GameContext);
  return (
    <>
      { scene !== "Study" ? <MenuBarDefault/> : null }
      { scene === "Study" ? <MenuBarStudy/> : null }
    </>
  );
}