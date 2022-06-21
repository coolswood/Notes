import type { CSSProperties, FC } from 'react'
import { memo, useEffect, useState } from 'react'

import { Box } from '../Box/Box.js'

const styles: CSSProperties = {
    display: 'inline-block',
    transform: 'rotate(-7deg)',
    WebkitTransform: 'rotate(-7deg)',
}

export interface BoxDragPreviewProps {
    text: string
}

export interface BoxDragPreviewState {
    tickTock: any
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
    function BoxDragPreview({ text }) {
        return (
            <div style={styles}>
                <Box title={text} preview />
            </div>
        )
    },
)
