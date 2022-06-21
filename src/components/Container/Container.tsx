import update from 'immutability-helper'
import type {CSSProperties, FC} from 'react'
import {useEffect, useRef} from 'react'
import {createRef} from 'react'
import {useCallback, useState} from 'react'
import {useDrop} from 'react-dnd'
import {boxSize, ItemTypes, placeholder} from 'src/constants'
import {ApiRequest, getRandomInt} from 'src/helper'
import type {DragItem} from 'src/types'

import {DraggableBox} from '../DraggableBox/DraggableBox'

import styles from './styles.module.scss'

type BoxMap = api.getTickets.response;

export const Container: FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [boxes, setBoxes] = useState<BoxMap>({});

    const authUser = () => {
        const result = prompt('Fill your name');

        ApiRequest('create', {user: result}, 'PUT').then(() => setIsLoaded(true));
    }

    useEffect(() => {
            ApiRequest<api.getTickets.response, api.getTickets.request>('tickets', {}, 'GET').then((response) => {
                setBoxes(response);
                setIsLoaded(true);
            }).catch(() => {
                authUser();
            })
    }, [isLoaded])

    const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
        const id = getRandomInt();
        const screenY = e.screenY - boxSize.height / 2;
        const screenX = e.screenX - boxSize.width / 2;

        ApiRequest<api.putTicket.response[], api.putTicket.request>('ticket', {
            id,
            text: placeholder,
            screenY: screenY,
            screenX: screenX
        }, 'PUT');

        setBoxes(
            {
                ...boxes, ...{
                    [id]: {
                        screenY,
                        screenX,
                        text: placeholder,
                        canEdit: true,
                    }
                }
            }
        )
    }

    const moveBox = (id: string, screenX: number, screenY: number) => {
        ApiRequest<api.patchTicket.response, api.patchTicket.request>('ticket', {
            id,
            screenX,
            screenY
        }, 'PATCH');

            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: {screenX, screenY},
                    },
                }),
            )
        }

        const onUpdateText = (id: string, text: string) => {
            ApiRequest<api.patchTicket.response, api.patchTicket.request>('ticket', {
                id,
                text
            }, 'PATCH');

            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: {text},
                    },
                }),
            )
        }

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

    if(!isLoaded) return null;

    return (
        <div ref={drop} style={{
            width: window.screen.width,
            height: window.screen.height,
            position: 'relative',
        }}>
            <div className={styles.clickListener} onClick={createNewBox}/>
            {Object.keys(boxes).map((key) => (
                <DraggableBox
                    onUpdateText={(text) => onUpdateText(key, text)}
                    key={key}
                    id={key}
                    {...boxes[key]}
                />
            ))}
        </div>
    )
}
