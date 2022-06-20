import type { CSSProperties, FC } from 'react'
import { memo } from 'react'

import styles from './styles.module.scss'

export interface BoxProps {
    title: string
    preview?: boolean
    onInput?: (e: String) => void
}

export const boxSize = {
    width: 200,
    height: 300,
}

export const Box: FC<BoxProps> = memo(function Box({ title, preview, onInput }) {
    return (
        <div
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                if(onInput) {
                    onInput(e.target.innerText)
                }
            }}
            contentEditable="true"
            style={boxSize}
            className={styles.box}
            role={preview ? 'BoxPreview' : 'Box'}
        >
            {title}
        </div>
    )
})
