import update from 'immutability-helper'
import type {CSSProperties, FC} from 'react'
import {useEffect, useRef} from 'react'
import {createRef} from 'react'
import {useCallback, useState} from 'react'
import {useDrop} from 'react-dnd'
import {ApiRequest, getRandomInt} from 'src/helper'
import {DragItem} from 'src/types'
import {boxSize} from '../Box/Box'
import {ItemTypes} from '../CustomDragLayer/CustomDragLayer'

import {DraggableBox} from '../DraggableBox/DraggableBox'

import styles from './styles.module.scss'

interface BoxMap {
    [key: string]: { screenY: number; screenX: number; text: string }
}

export const Container: FC = () => {
    const [boxes, setBoxes] = useState<BoxMap>({});

    useEffect(() => {
        ApiRequest('tickets', {}, 'GET').then((data) => {

        })
    }, [])

    const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
        const screenY = e.screenY - boxSize.height / 2;
        const screenX = e.screenX - boxSize.width / 2;

        // ApiRequest('ticket', {
        //     text: 'Тестовый запрос',
        //     screenY: String(screenY),
        //     screenX: String(screenX)
        // }, 'PUT').then(console.log);

        setBoxes(
            {
                ...boxes, ...{
                    [getRandomInt()]: {
                        screenY,
                        screenX,
                        text: getRandomInt()
                    }
                }
            }
        )
    }

    const updateCardValue = (value: string, id: string) => {
        
    }

    const moveBox = useCallback(
        (id: string, screenX: number, screenY: number) => {
            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: {screenX, screenY},
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

                let screenX = Math.round(item.screenX + delta.x)
                let screenY = Math.round(item.screenY + delta.y)

                moveBox(item.id, screenX, screenY)
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
                    {...(boxes[key] as { screenY: number; screenX: number; text: string })}
                />
            ))}
        </div>
    )
}
