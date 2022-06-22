import type { CSSProperties, FC } from 'react';
import { memo, useEffect } from 'react';
import type { DragSourceMonitor } from 'react-dnd';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { ItemTypes } from 'src/constants';

import { Box } from '../Box/Box';
import cookie from 'js-cookie';
import type { BoxMap } from 'src/types';

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
  canEdit: boolean
): CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
    zIndex: canEdit ? 1 : 0,
  };
}

type DraggableBoxProps = {
  id: string;
  onUpdateText: (text: string) => void;
} & BoxMap[string];

export const DraggableBox: FC<DraggableBoxProps> = memo(function DraggableBox(
  props
) {
  const { id, text, screenX, screenY, onUpdateText, user, color } = props;
  const canEdit = user === cookie.get('user');

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, screenY, screenX, text, color },
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, screenY, screenX, text]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      ref={canEdit ? drag : undefined}
      style={{ ...getStyles(screenX, screenY, isDragging, canEdit) }}
      role="DraggableBox"
    >
      <Box
        color={color}
        text={text}
        canEdit={canEdit}
        onUpdateText={onUpdateText}
        user={user}
      />
    </div>
  );
});
