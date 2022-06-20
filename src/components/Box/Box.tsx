import type { CSSProperties, FC } from 'react'
import { memo } from 'react'

import styles from './styles.module.scss'

export interface BoxProps {
    title: string
    preview?: boolean
}

export const Box: FC<BoxProps> = memo(function Box({ title, preview }) {
    return (
        <div
            className={styles.box}
            role={preview ? 'BoxPreview' : 'Box'}
        >
            {title}
        </div>
    )
})
