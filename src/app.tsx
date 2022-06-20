import type {FC} from 'react'
import {useCallback, useState} from 'react'
import Dialog from '@mui/material/Dialog';

import {Container} from './components/Container/Container'
import {CustomDragLayer} from './components/CustomDragLayer/CustomDragLayer'
import Popup from './components/Popup/Popup';

export const App: FC = () => {
    return (
        <div>
            <Popup/>
            <Container/>
            <CustomDragLayer/>
        </div>
    )
}
