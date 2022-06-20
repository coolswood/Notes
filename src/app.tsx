import type { FC } from 'react'
import { useCallback, useState } from 'react'

import { Container } from './components/Container/Container'
import { CustomDragLayer } from './components/CustomDragLayer/CustomDragLayer'

export const App: FC = () => {
    return (
        <div>
            <Container />
            <CustomDragLayer />
        </div>
    )
}
