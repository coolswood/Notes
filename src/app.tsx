import {Container} from './components/Container/Container'
import {CustomDragLayer} from './components/CustomDragLayer/CustomDragLayer'
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from 'react-dnd';

export const App = () => {
    return (
        <DndProvider backend={HTML5Backend}>
        <div>
            <Container/>
            <CustomDragLayer/>
        </div>
        </DndProvider>
    )
}
