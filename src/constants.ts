export const ItemTypes = {
  BOX: 'box',
};

export type BoxMap = {
  [id: string]: {
    text: string;
    screenY: number;
    screenX: number;
    user?: string;
  };
};

export const boxSize = {
  width: 200,
  height: 300,
};

export const placeholder = 'Click on text to edit';
