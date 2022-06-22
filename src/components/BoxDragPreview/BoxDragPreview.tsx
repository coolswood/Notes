import type { CSSProperties, FC } from 'react';
import { memo } from 'react';

import { Box } from '../Box/Box.js';

const styles: CSSProperties = {
  display: 'inline-block',
  transform: 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)',
};

export interface BoxDragPreviewProps {
  text: string;
}

export const BoxDragPreview: FC<BoxDragPreviewProps> = memo(
  function BoxDragPreview({ text }) {
    return (
      <div style={styles}>
        <Box canEdit={true} text={text} preview />
      </div>
    );
  }
);
