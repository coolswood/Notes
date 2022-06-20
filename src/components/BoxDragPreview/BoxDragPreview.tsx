import type { CSSProperties, FC } from 'react'
import { memo, useEffect, useState } from 'react'

import { Box } from '../Box/Box.js'

const styles: CSSProperties = {
    display: 'inline-block',
    transform: 'rotate(-7deg)',
    WebkitTransform: 'rotate(-7deg)',
}

export interface BoxDragPreviewProps {
    title: string
}

export interface BoxDragPreviewState {
    tickTock: any
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
    function BoxDragPreview({ title }) {
        return (
            <div style={styles}>
                <Box title={title} preview />
            </div>
        )
    },
)
