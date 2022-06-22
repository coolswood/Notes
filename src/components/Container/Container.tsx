import update from 'immutability-helper';
import type { FC } from 'react';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import useWebSocket from 'react-use-websocket';
import { boxSize, ItemTypes } from 'src/constants';
import { getRandomInt, randomColourGenerator } from 'src/helper';
import { DraggableBox } from '../DraggableBox/DraggableBox';
import cookie from 'js-cookie';

import styles from './styles.module.scss';
import type { BoxMap } from 'src/types';

const socketUrl = 'ws://127.0.0.1:3001/ws';

export const Container: FC = () => {
  const [boxes, setBoxes] = useState<BoxMap>({});

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    queryParams: { user: cookie.get('user')! },
    onOpen: () => {
      const message: api.swMessage.getTickets.frontMessage = {
        event: 'GET_TICKETS',
      };

      sendJsonMessage(message);
    },
    onMessage: message => {
      const data: api.swMessage.getTickets.backMessage = JSON.parse(
        message.data
      );

      setBoxes(data);
    },
    onError: error => {
      console.error('error', error);
    },
    shouldReconnect: closeEvent => true,
  });

  const createNewBox = (e: React.MouseEvent<HTMLElement>) => {
    const id = getRandomInt();
    const screenY = e.screenY - boxSize.height / 2;
    const screenX = e.screenX - boxSize.width / 2;
    const color = randomColourGenerator();

    const message: api.swMessage.putTicket.frontMessage = {
      event: 'PUT_TICKET',
      data: { id, screenX, screenY, text: '', color },
    };

    sendJsonMessage(message);

    setBoxes({
      ...boxes,
      ...{
        [id]: {
          screenY,
          screenX,
          text: '',
          color,
        },
      },
    });
  };

  const moveBox = (id: string, screenX: number, screenY: number) => {
    const message: api.swMessage.patchTicket.frontMessage = {
      event: 'PATCH_TICKET',
      data: { id, screenX, screenY },
    };

    sendJsonMessage(message);

    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { screenX, screenY },
        },
      })
    );
  };

  const onUpdateText = (id: string, text: string) => {
    const message: api.swMessage.patchTicket.frontMessage = {
      event: 'PATCH_TICKET',
      data: { id, text },
    };

    sendJsonMessage(message);

    setBoxes(
      update(boxes, {
        [id]: {
          $merge: { text },
        },
      })
    );
  };

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: BoxMap[string] & { id: string }, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as {
          x: number;
          y: number;
        };

        let screenX = Math.round(item.screenX + delta.x);
        let screenY = Math.round(item.screenY + delta.y);

        moveBox(item.id, screenX, screenY);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <div
      ref={drop}
      style={{
        width: window.screen.width,
        height: window.screen.height,
        position: 'relative',
      }}
    >
      <div className={styles.clickListener} onClick={createNewBox} />
      {Object.keys(boxes).map(key => (
        <DraggableBox
          onUpdateText={(text: string) => onUpdateText(key, text)}
          key={key}
          id={key}
          {...boxes[key]}
        />
      ))}
    </div>
  );
};
