import React, {useEffect, useState} from 'react';
import ChecklistGroup from './ChecklistGroup';
import ChecklistPersonal from './ChecklistPersonal';
import ChecklistTab from './ChecklistTab';

import { ReloadContext } from "../request/ReloadContext";

export default function ChecklistContainer() {
    const [isPersonal, setPersonal] = useState(true);
    const [reloadTime, setReloadTime] = useState(new Date());
    const callSwitch = () => {
        setPersonal(!isPersonal);
    }
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