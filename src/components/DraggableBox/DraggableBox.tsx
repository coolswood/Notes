import type { CSSProperties, FC } from 'react'
import { memo, useEffect } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { Box } from '../Box/Box'
import { ItemTypes } from '../CustomDragLayer/CustomDragLayer'

function getStyles(
    left: number,
    top: number,
    isDragging: boolean,
): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`
    return {
        position: 'absolute',
        transform,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
    }
}

export interface DraggableBoxProps {
    id: string
    text: string
    screenX: number
    screenY: number
    onInput: (test: string
    ) => void
}

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
    props,
) {
    const { id, text, screenX, screenY, onInput } = props
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.BOX,
            item: { id, screenY, screenX, text },
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, screenY, screenX, text],
    )

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    return (
        <div
            ref={drag}
            style={getStyles(screenX, screenY, isDragging)}
            role="DraggableBox"
        >
            <Box title={text} onInput={onInput} />
        </div>
    )
})
