import React, {useEffect, useState, useContext} from 'react';
import ChecklistGroup from './ChecklistGroup';
import ChecklistPersonal from './ChecklistPersonal';
import ChecklistTab from './ChecklistTab';

import { ReloadContext } from "../request/ReloadContext";
import { GameContext } from "../../App";

export default function ChecklistContainer() {
    const [isPersonal, setPersonal] = useState(true);
    const [reloadTime, setReloadTime] = useState(new Date());
    const callSwitch = () => {
        setPersonal(!isPersonal);
    }
    const {game} = useContext(GameContext);

    useEffect(() => {
        const disableInput = () => {
          game.current.game.input.keyboard.enabled = false;
          game.current.game.input.mouse.enabled = false;
        }
        disableInput();
        return () => {
          game.current.game.events.off("ready", disableInput);
          game.current.game.input.keyboard.enabled = true;
          game.current.game.input.mouse.enabled = true;
        }
      }, []);

    return(
    <ReloadContext.Provider value = {{reloadTime, setReloadTime}}>
        <div>
            <ChecklistTab
                state={isPersonal}
                setPersonal={setPersonal}
                ></ChecklistTab>
            {isPersonal && <ChecklistPersonal callSwitch={callSwitch}></ChecklistPersonal>}
            {!isPersonal && <ChecklistGroup></ChecklistGroup>}
        </div>
    </ReloadContext.Provider>
    )
}