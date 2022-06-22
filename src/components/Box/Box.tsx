import clsx from 'clsx';
import type { FC } from 'react';
import { memo, useState } from 'react';
import { boxSize, placeholder } from 'src/constants';

import styles from './styles.module.scss';

export interface BoxProps {
  text: string;
  color: string;
  user?: string;
  preview?: boolean;
  canEdit?: boolean;
  onUpdateText?: (text: string) => void;
}

export const Box: FC<BoxProps> = memo(function Box({
  text,
  preview,
  onUpdateText,
  canEdit,
  user,
  color,
}) {
  const [value, setValue] = useState(text);
  const [isEdit, setIsEdit] = useState(false);

  const saveText = () => {
    setIsEdit(false);
    onUpdateText && onUpdateText(value);
  };

  return (
    <div
      style={{ ...boxSize, backgroundColor: color }}
      className={clsx(styles.box, !canEdit && styles.boxDisabled)}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div className={styles.labelWrap}>
        <div className={styles.label}>{canEdit ? 'You' : user}</div>
      </div>
      {isEdit ? (
        <div className={styles.editWrapper}>
          <textarea
            rows={7}
            value={value}
            onInput={(e: any) => {
              setValue(e.target.value);
            }}
          />
          <button onClick={saveText}>Save</button>
        </div>
      ) : (
        <div onClick={canEdit ? () => setIsEdit(true) : undefined}>
          {text === '' ? placeholder : text}
        </div>
      )}
    </div>
  );
});
