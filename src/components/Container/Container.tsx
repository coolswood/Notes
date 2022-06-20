import update from 'immutability-helper'
import type {CSSProperties, FC} from 'react'
import {useEffect, useRef} from 'react'
import {createRef} from 'react'
import {useCallback, useState} from 'react'
import {useDrop} from 'react-dnd'
import {getRandomInt} from 'src/helper'
import {DragItem} from 'src/types'
import {boxSize} from '../Box/Box'
import {ItemTypes} from '../CustomDragLayer/CustomDragLayer'

import {DraggableBox} from '../DraggableBox/DraggableBox'

import styles from './styles.module.scss'

interface BoxMap {
    [key: string]: { top: number; left: number; title: string }
}

export const Container: FC = () => {
    const [boxes, setBoxes] = useState<BoxMap>({});

    const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
        setBoxes(
            {
                ...boxes, ...{
                    [getRandomInt()]: {
                        top: e.screenY - boxSize.height / 2,
                        left: e.screenX - boxSize.width / 2,
                        title: getRandomInt()
                    }
                }
            }
        )
    }

    const updateCardValue = (value: string, id: string) => {
        
    }

    const moveBox = useCallback(
        (id: string, left: number, top: number) => {
            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: {left, top},
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

    console.log(boxes)

    return (
        <div ref={drop} style={{
            width: window.screen.width,
            height: window.screen.height,
            position: 'relative',
        }}>
            <div className={styles.clickListener} onClick={createNewBox} />
            {Object.keys(boxes).map((key) => (
                <DraggableBox
                    onInput={(test: string) => updateCardValue(test, key)}
                    key={key}
                    id={key}
                    {...(boxes[key] as { top: number; left: number; title: string })}
                />
            ))}
        </div>
    )
}
