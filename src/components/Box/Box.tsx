import type { CSSProperties, FC } from 'react'
import { memo } from 'react'

import styles from './styles.module.scss'

export interface BoxProps {
    text: string
    preview?: boolean
    onInput?: (e: String) => void
}

export const boxSize = {
    width: 200,
    height: 300,
}

export const Box: FC<BoxProps> = memo(function Box({ text, preview, onInput }) {
    return (
        <div
            style={boxSize}
            className={styles.box}
            role={preview ? 'BoxPreview' : 'Box'}
        >
            {text}
        </div>
    )
})
