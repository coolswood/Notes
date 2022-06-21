import clsx from 'clsx'
import type {CSSProperties, FC} from 'react'
import {useState} from 'react'
import {memo} from 'react'
import {boxSize} from 'src/constants'

import styles from './styles.module.scss'

export interface BoxProps {
    text: string
    user?: string
    preview?: boolean
    canEdit?: boolean
    onUpdateText?: (text: string) => void
}

export const Box: FC<BoxProps> = memo(function Box({text, preview, onUpdateText, canEdit, user}) {
    const [value, setValue] = useState(text);
    const [isEdit, setIsEdit] = useState(false);

    const saveText = () => {
        setIsEdit(false);
        onUpdateText && onUpdateText(value);
    }

    return (
        <div
            style={boxSize}
            className={clsx(styles.box, !canEdit && styles.boxDisabled)}
            role={preview ? 'BoxPreview' : 'Box'}
        >
            <div className={styles.labelWrap}>
                <div className={styles.label}>{user === undefined ? 'You' : user}</div>
            </div>
            {isEdit ? <div className={styles.editWrapper}>
                <textarea rows={7} value={value} onInput={(e: any) => {
                    setValue(e.target.value);
                }}/>
                <button onClick={saveText}>Save</button>
            </div> : <div onClick={canEdit ? () => setIsEdit(true) : undefined}>{text}</div>}
        </div>
    )
})
