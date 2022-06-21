import update from 'immutability-helper'
import type {CSSProperties, FC} from 'react'
import {useEffect, useRef} from 'react'
import {createRef} from 'react'
import {useCallback, useState} from 'react'
import {useDrop} from 'react-dnd'
import {ApiRequest, getRandomInt} from 'src/helper'
import type {DragItem} from 'src/types'
import {boxSize} from '../Box/Box'
import {ItemTypes} from '../CustomDragLayer/CustomDragLayer'

import {DraggableBox} from '../DraggableBox/DraggableBox'

import styles from './styles.module.scss'

type BoxMap = api.getTickets.response;

export const Container: FC = () => {
    const [boxes, setBoxes] = useState<BoxMap>({});

    useEffect(() => {
        ApiRequest<api.getTickets.response, api.getTickets.request>('tickets', {}, 'GET').then(setBoxes).catch(console.error)
    }, [])

    const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
        const id = getRandomInt();
        const screenY = e.screenY - boxSize.height / 2;
        const screenX = e.screenX - boxSize.width / 2;

        ApiRequest<api.putTicket.response[], api.putTicket.request>('ticket', {
            id,
            text: 'Тестовый запрос',
            screenY: screenY,
            screenX: screenX
        }, 'PUT').then(console.log);

        setBoxes(
            {
                ...boxes, ...{
                    [id]: {
                        screenY,
                        screenX,
                        text: id,
                        canEdit: true,
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
