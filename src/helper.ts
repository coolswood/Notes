import axios, { Method } from "axios";
import dayjs from "dayjs";
import { api } from "diary-mind-health";

export const ApiRequest = <R>(
    data: string,
    method: Method = 'POST'
): Promise<R> => {
    return axios({
        url: `https://mind-health.ru/gq`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method,
        data: {
            query: data,
        },
    }).then(({ data }) => data.data);
};

export function snapToGrid(x: number, y: number): [number, number] {
    const snappedX = Math.round(x / 32) * 32
    const snappedY = Math.round(y / 32) * 32
    return [snappedX, snappedY]
}