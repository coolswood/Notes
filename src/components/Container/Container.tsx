import update from 'immutability-helper'
import type {FC} from 'react'
import {useEffect, useRef} from 'react'
import {useState} from 'react'
import {useDrop} from 'react-dnd'
import useWebSocket from 'react-use-websocket'
import {boxSize, ItemTypes, placeholder} from 'src/constants'
import {ApiRequest, getRandomInt} from 'src/helper'
import type {DragItem} from 'src/types'
import { DraggableBox } from '../DraggableBox/DraggableBox'
import cookie from 'js-cookie';

import styles from './styles.module.scss'

type BoxMap = api.getTickets.response;

const socketUrl = 'ws://127.0.0.1:3001/ws';

export const Container: FC = () => {
    const [boxes, setBoxes] = useState<BoxMap>({});

    const {
        sendJsonMessage,
    } = useWebSocket(socketUrl, {
        queryParams: {user: cookie.get('user')!},
        onOpen: () => {
            sendJsonMessage({event: 'getTickets'});
        },
        onMessage: (message) => {
            console.log(message.data)
            setBoxes(JSON.parse(message.data));
        },
        onError: (error) => {
            console.log('error', error);
        },
        shouldReconnect: (closeEvent) => true,
    });

    const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
        const id = getRandomInt();
        const screenY = e.screenY - boxSize.height / 2;
        const screenX = e.screenX - boxSize.width / 2;

        sendJsonMessage({event: 'create', data: {id, screenX, screenY}});

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

        sendJsonMessage({event: 'update', data: {id, screenX, screenY}});

            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: {screenX, screenY},
                    },
                }),
            )
        }

        const onUpdateText = (id: string, text: string) => {

            sendJsonMessage({event: 'update', data: {id, text}});

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
