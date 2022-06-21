export const ItemTypes = {
    BOX: 'box',
}

export interface DragItem {
    id: string
    type: string
    screenX: number
    screenY: number
}