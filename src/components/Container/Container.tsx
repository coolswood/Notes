import update from 'immutability-helper'
import type { CSSProperties, FC } from 'react'
import { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { DragItem } from 'src/types'
import { ItemTypes } from '../CustomDragLayer/CustomDragLayer'

import { DraggableBox } from '../DraggableBox/DraggableBox'

const styles: CSSProperties = {
    width: window.screen.width,
    height: window.screen.height,
    position: 'relative',
}

interface BoxMap {
    [key: string]: { top: number; left: number; title: string }
}

export const Container: FC = () => {
    const [boxes, setBoxes] = useState<BoxMap>({
        a: { top: 20, left: 80, title: 'Drag me around' },
        b: { top: 180, left: 20, title: 'Drag me too' },
    })

    const moveBox = useCallback(
        (id: string, left: number, top: number) => {
            console.log(left, top)
            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: { left, top },
                    },
                }),
            )
        },
        [boxes],
    )

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.BOX,
            drop(item: DragItem, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as {
                    x: number
                    y: number
                }

                let left = Math.round(item.left + delta.x)
                let top = Math.round(item.top + delta.y)

                moveBox(item.id, left, top)
                return undefined
            },
        }),
        [moveBox],
    )

    return (
        <div ref={drop} style={styles}>
            {Object.keys(boxes).map((key) => (
                <DraggableBox
                    key={key}
                    id={key}
                    {...(boxes[key] as { top: number; left: number; title: string })}
                />
            ))}
        </div>
    )
}
