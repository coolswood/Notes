import clsx from 'clsx'
import type {CSSProperties, FC} from 'react'
import {useState} from 'react'
import {memo} from 'react'
import { boxSize } from 'src/constants'

import styles from './styles.module.scss'

export interface BoxProps {
    text: string
    preview?: boolean
    canEdit?: boolean
    onInput?: (e: String) => void
    onUpdateText?: (text: String) => void
}

export const Box: FC<BoxProps> = memo(function Box({text, preview, onInput, onUpdateText, canEdit}) {
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
            {isEdit ? <div className={styles.editWrapper}>
                <textarea rows={7} value={value} onInput={(e: any) => {
                    setValue(e.target.value);
                }}/>
                <button onClick={saveText}>Save</button>
            </div> : <div onClick={() => setIsEdit(true)}>{text}</div>}
        </div>
    )
})
