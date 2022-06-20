export const ItemTypes = {
    BOX: 'box',
}

export interface DragItem {
    id: string
    type: string
    left: number
    top: number
}