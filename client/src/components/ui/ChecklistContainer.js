import React, {useEffect, useState} from 'react';
import ChecklistGroup from './ChecklistGroup';
import ChecklistPersonal from './ChecklistPersonal';
import ChecklistTab from './ChecklistTab';

export default function ChecklistContainer() {
    const [isPersonal, setPersonal] = useState(true);

    return(
        <div>
            <ChecklistTab
                state={isPersonal}
                setPersonal={setPersonal}
                ></ChecklistTab>
            {isPersonal && <ChecklistPersonal></ChecklistPersonal>}
            {!isPersonal && <ChecklistGroup></ChecklistGroup>}
        </div>
    )
}