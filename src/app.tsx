import type {FC} from 'react'
import {useCallback, useEffect, useState} from 'react'
import Dialog from '@mui/material/Dialog';

import {Container} from './components/Container/Container'
import {CustomDragLayer} from './components/CustomDragLayer/CustomDragLayer'
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';
import {ApiRequest} from "src/helper";

export const App: FC = () => {
    useEffect(() => {
        // const result = prompt('Введите имя');
        //
        // ApiRequest('create', {name: result}, 'PUT').then(console.log);

        ApiRequest('tickets', {}, 'GET').then(console.log);
    }, [])

    return (
        <DndProvider backend={HTML5Backend}>
        <div>
            <Container/>
            <CustomDragLayer/>
        </div>
        </DndProvider>
    )
}
