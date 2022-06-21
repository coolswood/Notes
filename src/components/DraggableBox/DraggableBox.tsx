import type { CSSProperties, FC } from 'react'
import { memo, useEffect } from 'react'
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { ItemTypes } from 'src/constants'

import { Box } from '../Box/Box'

function getStyles(
    left: number,
    top: number,
    isDragging: boolean,
    canEdit: boolean,
): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`
    return {
        position: 'absolute',
        transform,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        zIndex: canEdit ? 1 : 0,
    }
}

export interface DraggableBoxProps {
    id: string
    text: string
    screenX: number
    screenY: number
    canEdit: boolean
    user?: string
    onUpdateText: (text: string) => void
}

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
    props,
) {
    const { id, text, screenX, screenY, onUpdateText, canEdit, user } = props
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
            ref={canEdit ? drag : undefined}
            style={{...getStyles(screenX, screenY, isDragging, canEdit)}}
            role="DraggableBox"
        >
            <Box text={text} canEdit={canEdit} onUpdateText={onUpdateText} user={user} />
        </div>
    )
})
